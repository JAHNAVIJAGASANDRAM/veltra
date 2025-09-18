import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  project: {
    type: String,
    trim: true,
    default: ''
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'review', 'done', 'blocked'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    default: null
  },
  estimatedHours: {
    type: Number,
    min: 0,
    default: 0
  },
  actualHours: {
    type: Number,
    min: 0,
    default: 0
  },
  labels: [{
    type: String,
    trim: true
  }],
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  relatedContent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  }],
  checklist: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    attachments: [{
      filename: String,
      originalName: String,
      mimeType: String,
      size: Number,
      url: String
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: Date
  }],
  history: [{
    action: {
      type: String,
      required: true,
      enum: ['created', 'status_changed', 'assigned', 'commented', 'updated', 'due_date_changed']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    details: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'push', 'in_app'],
      default: 'in_app'
    },
    scheduledAt: Date,
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  }],
  completion: {
    completedAt: Date,
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewComments: String
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  customFields: [{
    fieldName: String,
    fieldType: {
      type: String,
      enum: ['text', 'number', 'date', 'boolean', 'select']
    },
    value: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

// Indexes for better performance
taskSchema.index({ team: 1 });
taskSchema.index({ assignee: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ createdAt: 1 });
taskSchema.index({ labels: 1 });

// Virtual for checklist completion percentage
taskSchema.virtual('checklistProgress').get(function() {
  if (this.checklist.length === 0) return 100;
  const completed = this.checklist.filter(item => item.completed).length;
  return Math.round((completed / this.checklist.length) * 100);
});

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && this.status !== 'done';
});

// Methods
taskSchema.methods.addComment = function(userId, text, attachments = []) {
  this.comments.push({
    user: userId,
    text,
    attachments,
    createdAt: new Date()
  });
  
  this.history.push({
    action: 'commented',
    user: userId,
    details: { commentLength: text.length },
    timestamp: new Date()
  });
};

taskSchema.methods.changeStatus = function(userId, newStatus, comment = '') {
  const oldStatus = this.status;
  this.status = newStatus;
  
  this.history.push({
    action: 'status_changed',
    user: userId,
    details: { from: oldStatus, to: newStatus, comment },
    timestamp: new Date()
  });

  // If marking as done, set completion details
  if (newStatus === 'done') {
    this.completion = {
      completedAt: new Date(),
      completedBy: userId,
      reviewComments: comment
    };
  }
};

taskSchema.methods.addChecklistItem = function(text) {
  this.checklist.push({
    text,
    completed: false
  });
};

taskSchema.methods.completeChecklistItem = function(index, userId) {
  if (this.checklist[index]) {
    this.checklist[index].completed = true;
    this.checklist[index].completedAt = new Date();
    this.checklist[index].completedBy = userId;
  }
};

taskSchema.methods.addReminder = function(type, scheduledAt) {
  this.reminders.push({
    type,
    scheduledAt
  });
};

// Pre-save middleware
taskSchema.pre('save', function(next) {
  // Update history for certain changes
  if (this.isModified('assignee')) {
    this.history.push({
      action: 'assigned',
      user: this.creator, // or system?
      details: { to: this.assignee },
      timestamp: new Date()
    });
  }

  if (this.isModified('dueDate')) {
    this.history.push({
      action: 'due_date_changed',
      user: this.creator,
      details: { newDueDate: this.dueDate },
      timestamp: new Date()
    });
  }

  next();
});

export default mongoose.model('Task', taskSchema);