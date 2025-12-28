// CSV parser utility for bulk user uploads

export interface CSVUserRow {
  companyRelationship: string;
  name: string;
  email: string;
  userType: 'advisor' | 'company';
}

export interface CSVParseResult {
  success: boolean;
  data?: CSVUserRow[];
  errors?: string[];
  rowCount?: number;
}

export class CSVParser {
  /**
   * Parse CSV file for bulk user upload
   * Expected columns: Company Relationship, Name, Email, User Type
   */
  static async parseUserCSV(file: File): Promise<CSVParseResult> {
    return new Promise((resolve) => {
      const errors: string[] = [];
      const data: CSVUserRow[] = [];

      // Validate file type
      if (!file.name.endsWith('.csv')) {
        resolve({
          success: false,
          errors: ['Invalid file type. Please upload a CSV file.'],
        });
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        resolve({
          success: false,
          errors: ['File size exceeds 5MB limit.'],
        });
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          if (!text) {
            resolve({
              success: false,
              errors: ['Failed to read file content.'],
            });
            return;
          }

          // Split into lines
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length === 0) {
            resolve({
              success: false,
              errors: ['CSV file is empty.'],
            });
            return;
          }

          // Parse header
          const headerLine = lines[0];
          const headers = this.parseCSVLine(headerLine);

          // Validate headers
          const expectedHeaders = ['company relationship', 'name', 'email', 'user type'];
          const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
          
          const missingHeaders = expectedHeaders.filter(
            expected => !normalizedHeaders.includes(expected)
          );

          if (missingHeaders.length > 0) {
            resolve({
              success: false,
              errors: [
                `Missing required columns: ${missingHeaders.join(', ')}`,
                'Expected columns: Company Relationship, Name, Email, User Type',
              ],
            });
            return;
          }

          // Find column indexes
          const companyRelIdx = normalizedHeaders.indexOf('company relationship');
          const nameIdx = normalizedHeaders.indexOf('name');
          const emailIdx = normalizedHeaders.indexOf('email');
          const userTypeIdx = normalizedHeaders.indexOf('user type');

          // Parse data rows
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Skip empty lines

            const rowNumber = i + 1;
            const values = this.parseCSVLine(line);

            // Validate row has enough columns
            if (values.length < 4) {
              errors.push(`Row ${rowNumber}: Incomplete data (expected 4 columns)`);
              continue;
            }

            const companyRelationship = values[companyRelIdx]?.trim();
            const name = values[nameIdx]?.trim();
            const email = values[emailIdx]?.trim();
            const userType = values[userTypeIdx]?.trim().toLowerCase();

            // Validate required fields
            if (!companyRelationship) {
              errors.push(`Row ${rowNumber}: Company Relationship is required`);
              continue;
            }

            if (!name) {
              errors.push(`Row ${rowNumber}: Name is required`);
              continue;
            }

            if (!email) {
              errors.push(`Row ${rowNumber}: Email is required`);
              continue;
            }

            // Validate email format
            if (!email.includes('@') || !email.includes('.')) {
              errors.push(`Row ${rowNumber}: Invalid email format (${email})`);
              continue;
            }

            // Validate user type
            if (userType !== 'advisor' && userType !== 'company') {
              errors.push(
                `Row ${rowNumber}: Invalid user type (${userType}). Must be "Advisor" or "Company"`
              );
              continue;
            }

            // Add valid row
            data.push({
              companyRelationship,
              name,
              email,
              userType: userType as 'advisor' | 'company',
            });
          }

          // Check if we got any valid data
          if (data.length === 0 && errors.length > 0) {
            resolve({
              success: false,
              errors: ['No valid rows found in CSV.', ...errors],
            });
            return;
          }

          resolve({
            success: true,
            data,
            errors: errors.length > 0 ? errors : undefined,
            rowCount: data.length,
          });
        } catch (error) {
          resolve({
            success: false,
            errors: [
              'Failed to parse CSV file.',
              error instanceof Error ? error.message : 'Unknown error',
            ],
          });
        }
      };

      reader.onerror = () => {
        resolve({
          success: false,
          errors: ['Failed to read file.'],
        });
      };

      reader.readAsText(file);
    });
  }

  /**
   * Parse a single CSV line, handling quoted values
   */
  private static parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current); // Add last value
    return values.map(v => v.trim());
  }

  /**
   * Generate a sample CSV template
   */
  static generateSampleCSV(): string {
    return [
      'Company Relationship,Name,Email,User Type',
      'Acme Corp,John Doe,john.doe@example.com,Advisor',
      'TechStart Inc,Jane Smith,jane.smith@example.com,Company',
      'Global Solutions,Mike Johnson,mike.j@example.com,Advisor',
    ].join('\n');
  }

  /**
   * Download sample CSV template
   */
  static downloadSampleCSV(): void {
    const csv = this.generateSampleCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ethiq_users_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
