import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['blog', 'social_media', 'podcast', 'video', 'document', 'template'],
    required: true
  },
  format: {
    type: String,
    enum: ['text', 'markdown', 'html', 'audio', 'video'],
    default: 'text'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'in_review', 'approved', 'scheduled', 'published', 'archived'],
    default: 'draft'
  },
  category: {
    type: String,
    trim: true,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  meta: {
    wordCount: {
      type: Number,
      default: 0
    },
    readTime: {
      type: Number, // minutes
      default: 0
    },
    characterCount: {
      type: Number,
      default: 0
    }
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['writer', 'editor', 'reviewer', 'approver'],
      default: 'writer'
    },
    contributedAt: {
      type: Date,
      default: Date.now
    }
  }],
  revisions: [{
    content: String,
    version: Number,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    changes: [String]
  }],
  approval: {
    required: {
      type: Boolean,
      default: false
    },
    approvers: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      feedback: String,
      approvedAt: Date
    }],
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date
  },
  scheduling: {
    publishAt: Date,
    publishedAt: Date,
    platform: {
      type: String,
      enum: ['instagram', 'twitter', 'linkedin', 'youtube', 'blog', 'website'],
      default: 'blog'
    },
    externalId: String, // ID from external platform
    scheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    engagements: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    }
  },
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
  isPublic: {
    type: Boolean,
    default: false
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateData: {
    variables: [{
      name: String,
      type: {
        type: String,
        enum: ['text', 'number', 'date', 'select'],
        default: 'text'
      },
      defaultValue: mongoose.Schema.Types.Mixed,
      required: Boolean,
      options: [String]
    }],
    category: String,
    usageCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
contentSchema.index({ author: 1 });
contentSchema.index({ team: 1 });
contentSchema.index({ status: 1 });
contentSchema.index({ type: 1 });
contentSchema.index({ 'scheduling.publishAt': 1 });
contentSchema.index({ createdAt: 1 });
contentSchema.index({ tags: 1 });

// Methods
contentSchema.methods.addCollaborator = function(userId, role = 'writer') {
  const existing = this.collaborators.find(c => 
    c.user.toString() === userId.toString()
  );
  
  if (!existing) {
    this.collaborators.push({
      user: userId,
      role,
      contributedAt: new Date()
    });
  }
};

contentSchema.methods.createRevision = function(content, userId, changes = []) {
  const version = this.revisions.length + 1;
  this.revisions.unshift({
    content,
    version,
    createdBy: userId,
    changes,
    createdAt: new Date()
  });
};

contentSchema.methods.requestApproval = function(approvers) {
  this.status = 'in_review';
  this.approval.approvers = approvers.map(userId => ({
    user: userId,
    status: 'pending'
  }));
};

contentSchema.methods.calculateMetrics = function() {
  this.meta.wordCount = this.content.split(/\s+/).length;
  this.meta.characterCount = this.content.length;
  this.meta.readTime = Math.ceil(this.meta.wordCount / 200); // 200 words per minute
};

// Pre-save middleware
contentSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.calculateMetrics();
    
    // Auto-create revision if content changed significantly
    if (this.revisions.length === 0 || 
        this.revisions[0].content !== this.content) {
      this.createRevision(this.content, this.author, ['Content updated']);
    }
  }
  next();
});

export default mongoose.model('Content', contentSchema);