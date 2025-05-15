export interface SmsMessage {
  id: string;
  sender: string;
  content: string;
  date: Date;
  status?: 'pending' | 'success' | 'error';
  statusIcon?: string;
  statusClass?: string;
  apiResponse?: any;
}