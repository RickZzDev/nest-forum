import { WatchedList } from '../../../../../src/core/entities/watched_list'
import { QuestionAttachment } from './question_attachment'

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
