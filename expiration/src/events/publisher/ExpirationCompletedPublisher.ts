import {
  Subjects, 
  Publisher, 
  ExpirationCompleteEvent 
} from '@goodtickets/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}