import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PublicDataService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import { CacheService } from 'ng2-cache-service';
import { of, throwError as observableThrowError } from 'rxjs';
import { OfflineReportIssuesService } from './offline-report-issues.service';
import { response } from './offline-report-issues.service.spec.data';

describe('OfflineReportIssuesService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, SharedModule.forRoot()],
    providers: [OfflineReportIssuesService,
      PublicDataService, CacheService]
  }));

  it('should be call report other issue method and successfully raise ticket case', () => {
    const service: OfflineReportIssuesService = TestBed.get(OfflineReportIssuesService);
    const params = {
      email: 'sample@emal.com',
      description: 'sample description'
    };
    spyOn(service, 'reportOtherIssue').and.callFake(() => of(response.reportOtherIssueStatusSuccess.success));
    service.reportOtherIssue(params).subscribe(data => {
      expect(data).toBe(response.reportOtherIssueStatusSuccess.success);
    });

  });
  it('should be call report other issue method and error while submiting raise ticket case', () => {
    const service: OfflineReportIssuesService = TestBed.get(OfflineReportIssuesService);
    const params = {
      email: 'sample@emal.com',
      description: 'sample description'
    };
    spyOn(service, 'reportOtherIssue').and.returnValue(observableThrowError(response.reportOtherIssueStatusError.error));
    service.reportOtherIssue(params).subscribe(data => {
    }, err => {
      expect(err).toBe(response.reportOtherIssueStatusError.error);
    });
  });
});
