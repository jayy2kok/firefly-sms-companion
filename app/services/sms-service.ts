import { android, Device, Utils } from '@nativescript/core';
import { SmsMessage } from '../models/sms-message.model';

export class SmsService {
  /**
   * Gets SMS messages from a specific date
   * @param fromDate The date from which to fetch SMS messages
   * @returns Promise<SmsMessage[]> Array of SMS messages
   */
  async getSmsFromDate(fromDate: Date): Promise<SmsMessage[]> {
    // Only Android supported for now
    if (Device.os !== 'Android') {
      throw new Error('SMS reading is only supported on Android devices');
    }
    
    return this.getAndroidSmsMessages(fromDate);
  }
  
  /**
   * Gets SMS messages on Android using ContentResolver
   */
  private async getAndroidSmsMessages(fromDate: Date): Promise<SmsMessage[]> {
    const messages: SmsMessage[] = [];
    
    try {
      // Get timestamp from the fromDate (in milliseconds)
      const timestamp = fromDate.getTime();
      
      // Define the content URI for SMS
      const uri = android.net.Uri.parse("content://sms/inbox");
      
      // Define the columns to retrieve
      const projection = [
        "_id",
        "address",
        "body",
        "date"
      ];
      
      // Set selection criteria to get messages after the fromDate
      const selection = "date >= ?";
      const selectionArgs = [`${timestamp}`];
      
      // Sort by date, newest first
      const sortOrder = "date DESC";
      
      // Get the ContentResolver
      const resolver = Utils.android.getApplicationContext().getContentResolver();
      
      // Query the SMS inbox
      const cursor = resolver.query(uri, projection, selection, selectionArgs, sortOrder);
      
      if (cursor) {
        try {
          // Get column indices
          const idIndex = cursor.getColumnIndex("_id");
          const addressIndex = cursor.getColumnIndex("address");
          const bodyIndex = cursor.getColumnIndex("body");
          const dateIndex = cursor.getColumnIndex("date");
          
          // Loop through cursor results
          while (cursor.moveToNext()) {
            const id = cursor.getString(idIndex);
            const address = cursor.getString(addressIndex);
            const body = cursor.getString(bodyIndex);
            const dateLong = cursor.getLong(dateIndex);
            
            // Create SmsMessage object
            const message: SmsMessage = {
              id: id,
              sender: address,
              content: body,
              date: new Date(dateLong),
              status: 'pending',
              statusIcon: '⌛',
              statusClass: 'status-pending'
            };
            
            messages.push(message);
          }
        } finally {
          cursor.close();
        }
      }
      
      return messages;
    } catch (error) {
      console.error('Error reading SMS messages:', error);
      throw error;
    }
  }
}