import { Permissions } from '@nativescript/permissions';
import { Device, Application, Utils, isAndroid, isIOS } from '@nativescript/core';

export class PermissionsService {
  /**
   * Requests SMS read permissions
   * @returns Promise<boolean> True if permission granted, false otherwise
   */
  async requestSmsPermissions(): Promise<boolean> {
    // iOS doesn't have native SMS read permission
    if (isIOS) {
      console.log('SMS read functionality is not available on iOS');
      return false;
    }
    
    if (isAndroid) {
      try {
        // Request the READ_SMS permission
        const permission = android.Manifest.permission.READ_SMS;
        const result = await Permissions.requestPermission(permission);
        
        // Also request READ_PHONE_STATE which might be needed on some devices
        await Permissions.requestPermission(android.Manifest.permission.READ_PHONE_STATE);
        
        return result === 'authorized';
      } catch (error) {
        console.error('Permission request error:', error);
        return false;
      }
    }
    
    return false;
  }
}