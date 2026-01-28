import { Component, Input, OnInit } from '@angular/core';
import { ExamsModule } from '@batstateu/exams';

@Component({
  imports: [ExamsModule],
  selector: 'batstateu-take-exam-result-view',
  templateUrl: './take-exam-result-view.component.html',
  styleUrls: ['./take-exam-result-view.component.less'],
})
export class TakeExamResultViewComponent implements OnInit {
  @Input() percentage!: number | null;
  @Input() examTitle!: string;
  @Input() scoreSummary!: string;
  constructor() {


  }

  ngOnInit(): void { }
}
