import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';

@Component({
  imports: [ReactiveFormsModule, FormsModule, NgZorroAntdModule, RouterLink, CommonModule],
  selector: 'batstateu-take-exam-result-view',
  templateUrl: './take-exam-result-view.component.html',
  styleUrls: ['./take-exam-result-view.component.less'],
})
export class TakeExamResultViewComponent implements OnInit {
  @Input() percentage!: number | null;
  @Input() examTitle!: string;
  @Input() scoreSummary!: string;
  constructor() {}

  ngOnInit(): void {}
}
