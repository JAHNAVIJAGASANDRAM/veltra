import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  avatar: {
    type: String,
    default: null
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'contributor', 'viewer'],
      default: 'contributor'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  invitations: [{
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    token: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'contributor', 'viewer'],
      default: 'contributor'
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'expired'],
      default: 'pending'
    }
  }],
  settings: {
    privacy: {
      type: String,
      enum: ['public', 'private', 'invite_only'],
      default: 'invite_only'
    },
    contentApproval: {
      type: Boolean,
      default: true
    },
    fileUploadLimit: {
      type: Number,
      default: 100 // MB
    }
  },
  stats: {
    totalMembers: {
      type: Number,
      default: 1
    },
    totalContent: {
      type: Number,
      default: 0
    },
    totalTasks: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
teamSchema.index({ owner: 1 });
teamSchema.index({ 'members.user': 1 });
teamSchema.index({ 'invitations.email': 1 });
teamSchema.index({ createdAt: 1 });

// Virtual for getting active members count
teamSchema.virtual('activeMembersCount').get(function() {
  return this.members.filter(member => 
    this.members.find(m => m.user.toString() === member.user.toString())
  ).length;
});

// Methods
teamSchema.methods.isMember = function(userId) {
  return this.members.some(member => 
    member.user.toString() === userId.toString()
  );
};

teamSchema.methods.isAdmin = function(userId) {
  const member = this.members.find(m => 
    m.user.toString() === userId.toString()
  );
  return member && member.role === 'admin';
};

teamSchema.methods.getMemberRole = function(userId) {
  const member = this.members.find(m => 
    m.user.toString() === userId.toString()
  );
  return member ? member.role : null;
};

export default mongoose.model('Team', teamSchema);