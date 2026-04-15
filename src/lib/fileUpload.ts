/** Max file size: 5 MB */
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

/** Accept attribute for PDF and JPG only */
export const ACCEPT_PDF_JPG = ".pdf,.jpg,.jpeg,application/pdf,image/jpeg,image/jpg";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
]);

const ALLOWED_EXTENSIONS = /\.(pdf|jpe?g)$/i;

/** Dictionary key for file too large – translate with t() when displaying */
export const FILE_VALIDATION_KEY_TOO_LARGE = "Forms_Shared_FileValidation_TooLarge";
/** Dictionary key for invalid file type – translate with t() when displaying */
export const FILE_VALIDATION_KEY_INVALID_TYPE = "Forms_Shared_FileValidation_InvalidType";

/**
 * Validates a file for upload: PDF or JPG, max 5 MB.
 * Returns a dictionary key (or null if valid). Display with t(key) in the form.
 */
export function validateUploadFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return FILE_VALIDATION_KEY_TOO_LARGE;
  }
  const typeOk = ALLOWED_TYPES.has(file.type);
  const nameOk = ALLOWED_EXTENSIONS.test(file.name);
  if (!typeOk && !nameOk) {
    return FILE_VALIDATION_KEY_INVALID_TYPE;
  }
  return null;
}
