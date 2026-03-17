import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Exam } from '@batstateu/data-models';
@Component({
  selector: 'batstateu-exam-instruction-view',
  templateUrl: './exam-instruction-view.component.html',
  styleUrls: ['./exam-instruction-view.component.less'],
})
export class ExamInstructionViewComponent implements OnInit, OnChanges {
  @Input() examDetail?: Exam;
  instruction = ''
  ngOnChanges(changes: SimpleChanges): void {
    if(this.examDetail && changes["examDetail"]){
      this.instruction = this.examDetail.instructions
    }
  }

  ngOnInit(): void {
  }
}
