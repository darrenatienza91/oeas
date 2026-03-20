import { Component, input } from '@angular/core';
import { Exam } from '@batstateu/data-models';
@Component({
  selector: 'batstateu-exam-instruction-view',
  templateUrl: './exam-instruction-view.component.html',
  styleUrls: ['./exam-instruction-view.component.less'],
})
export class ExamInstructionViewComponent {
  public examDetail = input<Exam | null>();
}
