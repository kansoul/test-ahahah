import mongoose, { Schema } from 'mongoose'
import { ParticipantInvitationStatus } from '~/constants/enums'

const participantSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: { type: Number, enum: ParticipantInvitationStatus, default: ParticipantInvitationStatus.Waiting }
})

export const Participant = mongoose.model('Participant', participantSchema)
