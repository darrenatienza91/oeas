import { NzModalService } from 'ng-zorro-antd/modal';

export const handleExamInitializationErrors = (
  error: Error,
  modal: NzModalService,
  goToDashBoard: () => void,
  goToResults: () => void,
): void => {
  switch (error.message) {
    case 'EXAM_NOT_ACTIVE':
      modal.error({
        nzTitle: 'Not Active Exam',
        nzContent: `Examination is not Active! <br/> Click Ok to proceed.`,
        nzOnOk: goToDashBoard,
      });
      break;

    case 'NO_QUESTIONS':
      modal.error({
        nzTitle: 'No Questions yet',
        nzContent: `This examination does not have any question yet! <br/> Click Ok to proceed.`,
        nzOnOk: goToDashBoard,
      });
      break;

    case 'EXAM_ALREADY_FINISHED':
      modal.error({
        nzTitle: 'Finished examination',
        nzContent: `You already completed the exam. <br/> Click Ok to view result`,
        nzOnOk: goToResults,
      });
      break;

    default:
      modal.error({
        nzTitle: 'Unexpected Error',
        nzContent: 'Something went wrong.',
      });
  }
};
