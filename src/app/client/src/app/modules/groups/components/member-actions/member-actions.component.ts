import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { IGroupMember } from '../../interfaces';
import { GroupsService } from '../../services/groups/groups.service';

export interface IMemberActionData {
  title: string;
  description: string;
  buttonText: string;
  theme?: 'primary' | 'error';
  eid: string;
}

@Component({
  selector: 'app-member-actions',
  templateUrl: './member-actions.component.html',
  styleUrls: ['./member-actions.component.scss']
})
export class MemberActionsComponent implements OnDestroy, OnInit {
  @ViewChild('modal') modal;
  @Input() action: string;
  @Input() member: IGroupMember;
  @Input() groupName: string;
  @Output() modalClose = new EventEmitter<void>();
  @Output() actionConfirm = new EventEmitter<any>();

  memberActionData: IMemberActionData;
  constructor(public resourceService: ResourceService, private groupService: GroupsService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    switch (this.action) {
      case 'promoteAsAdmin':
        this.memberActionData = {
          title: `${this.resourceService.frmelmnts.btn.makeAdmin}?`,
          description: _.replace(this.resourceService.frmelmnts.lbl.makeAdmin, '{memberName}', this.member.title),
          buttonText: this.resourceService.frmelmnts.btn.makeAdmin,
          theme: 'primary',
          eid: 'promote-as-admin-popup'
        };
        break;
      case 'removeFromGroup':
        this.memberActionData = {
          title: `${this.resourceService.frmelmnts.btn.removeMember}?`,
          description: _.replace(this.resourceService.frmelmnts.lbl.removeWarning, '{memberName}', this.member.title),
          buttonText: this.resourceService.frmelmnts.btn.removeMember,
          theme: 'error',
          eid: 'remove-from-group-popup'
        };
        break;
      case 'dismissAsAdmin':
        this.memberActionData = {
          title: `${this.resourceService.frmelmnts.btn.dismissAdmin}?`,
          description: _.replace(this.resourceService.frmelmnts.lbl.dismissWarning, '{memberName}', this.member.title),
          buttonText: this.resourceService.frmelmnts.btn.dismissAdmin,
          theme: 'primary',
          eid: 'dismiss-as-admin-popup'
        };
        break;
      case 'leaveFromGroup':
        this.memberActionData = {
          title: `${this.resourceService.frmelmnts.lbl.leaveGroup}?`,
          description: _.replace(this.resourceService.frmelmnts.lbl.leaveGroupWarning, '{groupName}', this.groupName),
          buttonText: this.resourceService.frmelmnts.lbl.leaveGroup,
          theme: 'error',
          eid: 'leave-from-group-popup'
        };
        break;
    }
  }

  closeModal() {
    this.modal.deny();
    this.modalClose.emit();
    this.addTelemetry(`close-${this.memberActionData.eid}`);
  }

  performAction() {
    this.actionConfirm.emit({ data: this.member, action: this.action });
    this.modal.deny();
    this.addTelemetry(`confirm-${this.memberActionData.eid}`);
  }

  addTelemetry(id) {
    this.groupService.addTelemetry(id, this.activatedRoute.snapshot);
  }

  ngOnDestroy() {
    if (this.modal.deny) {
      this.modal.deny();
    }
  }
}
