import { WatchedList } from '../../../../../src/core/entities/watched_list'
import { AnswerAttachment } from './answer_attachment'

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
