import { Observable, ObservableArray, fromObject } from '@nativescript/core';
import { SmsService } from '../services/sms-service';
import { ApiService } from '../services/api-service';
import { PermissionsService } from '../services/permissions-service';
import { SmsMessage } from '../models/sms-message.model';

export class HomeViewModel extends Observable {
  private smsService: SmsService;
  private apiService: ApiService;
  private permissionsService: PermissionsService;
  
  private _isLoading: boolean = false;
  private _fromDate: Date = new Date();
  private _messages: ObservableArray<SmsMessage> = new ObservableArray<SmsMessage>();

  constructor() {
    super();
    
    this.smsService = new SmsService();
    this.apiService = new ApiService();
    this.permissionsService = new PermissionsService();
    
    // Set default date to 7 days ago
    const today = new Date();
    today.setDate(today.getDate() - 7);
    this._fromDate = today;
    
    this.notifyPropertyChange('fromDate', this._fromDate);
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(value: boolean) {
    if (this._isLoading !== value) {
      this._isLoading = value;
      this.notifyPropertyChange('isLoading', value);
    }
  }

  get fromDate(): Date {
    return this._fromDate;
  }

  set fromDate(value: Date) {
    if (this._fromDate !== value) {
      this._fromDate = value;
      this.notifyPropertyChange('fromDate', value);
    }
  }

  get messages(): ObservableArray<SmsMessage> {
    return this._messages;
  }

  setToday() {
    this.fromDate = new Date();
  }

  async readSmsMessages() {
    try {
      this.isLoading = true;
      
      // Check permissions first
      const hasPermission = await this.permissionsService.requestSmsPermissions();
      
      if (!hasPermission) {
        this.showError('SMS permission denied');
        return;
      }
      
      // Get SMS messages from the selected date
      const messages = await this.smsService.getSmsFromDate(this.fromDate);
      
      // Clear existing messages
      this._messages.splice(0);
      
      // Process each message and call API
      for (const message of messages) {
        this._messages.push(message);
        
        try {
          // Call API with message data
          await this.apiService.sendMessageData(message);
          
          // Update message status on success
          message.status = 'success';
          message.statusIcon = '✓';
          message.statusClass = 'status-success';
        } catch (error) {
          // Update message status on error
          message.status = 'error';
          message.statusIcon = '!';
          message.statusClass = 'status-error';
        }
        
        // Notify of the change to update UI
        this._messages.splice(this._messages.indexOf(message), 1, message);
      }
    } catch (error) {
      this.showError(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      this.isLoading = false;
    }
  }

  onItemTap(args) {
    const message = this._messages.getItem(args.index);
    this.showMessageDetails(message);
  }
  
  onSettings() {
    // TODO: Implement settings page navigation
  }
  
  private showMessageDetails(message: SmsMessage) {
    // TODO: Show message details dialog or navigate to details page
    console.log(`Message details: ${JSON.stringify(message)}`);
  }
  
  private showError(message: string) {
    // TODO: Implement proper error dialog
    console.error(message);
  }
}