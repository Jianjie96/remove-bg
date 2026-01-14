/**
 * Remove.bg API TypeScript Type Definitions
 * Based on API documentation: https://www.remove.bg/api
 */

import Taro from "@tarojs/taro";

// ============================================
// Request Types
// ============================================

/**
 * Size options for the output image
 */
export type ImageSize =
  | "auto" // Uses highest available resolution based on image size and credits
  | "preview" // Low resolution preview
  | "small" // Small size (previously called 'regular')
  | "regular" // Deprecated, use 'small' instead
  | "medium" // Medium size
  | "hd" // HD quality
  | "4k" // 4K quality
  | "50MP"; // Up to 50 megapixels (8000x6250)

/**
 * Image format options
 */
export type ImageFormat =
  | "auto" // PNG if transparency detected, JPG otherwise
  | "png" // PNG format (supports transparency, up to 10MP)
  | "jpg" // JPG format (no transparency, up to 50MP)
  | "webp" // WebP format (supports transparency, up to 50MP)
  | "zip"; // ZIP format containing color.jpg and alpha.png (fastest, up to 50MP)

/**
 * Type of foreground to detect
 */
export type ForegroundType =
  | "auto" // Automatic detection
  | "person" // Person
  | "product" // Product
  | "animal" // Animal
  | "car" // Car / Vehicle
  | "transportation" // Transportation
  | "graphic" // Graphic
  | "other"; // Other foreground types

/**
 * Type level for detection confidence
 */
export type TypeLevel =
  | "none" // No type classification
  | "latest" // Latest classification algorithm
  | "1" // Version 1
  | "2"; // Version 2

/**
 * Output channels
 */
export type Channels =
  | "rgba" // Full RGBA image (default, recommended)
  | "alpha"; // Alpha mask only

/**
 * Region of Interest format: "x1 y1 x2 y2"
 * Coordinates can be absolute pixels (suffix 'px') or relative (suffix '%')
 * Example: "0% 0% 100% 100%" or "10px 20px 500px 400px"
 */
export type ROI = string;

/**
 * Position values for image placement
 */
export type Position =
  | "original" // Keep original position
  | "center" // Center the subject
  | string; // Custom position "horizontal vertical" (e.g., "50% 50%")

/**
 * Shadow type options
 */
export type ShadowType =
  | "none" // No shadow
  | "drop" // Drop shadow effect
  | "natural"; // Natural shadow

/**
 * Base parameters for background removal
 */
export interface RemoveBackgroundBaseParams {
  /** Output image size */
  size?: ImageSize;

  /** Output image format */
  format?: ImageFormat;

  /** Type of foreground to detect */
  type?: ForegroundType;

  /** Type detection confidence level */
  type_level?: TypeLevel;

  /** Output channels */
  channels?: Channels;

  /** Background color (hex code or color name, e.g., "81d4fa", "green", "81d4fa77" for semi-transparent) */
  bg_color?: string;

  /** URL of background image to add */
  bg_image_url?: string;

  /** Crop empty regions around the subject */
  crop?: boolean;

  /** Margin around cropped subject (only with crop=true), e.g., "10px", "5%" */
  crop_margin?: string;

  /** Scale subject relative to image size, e.g., "50%", "80%" */
  scale?: string;

  /** Position of subject in canvas */
  position?: Position;

  /** Region of Interest: only this region can be detected as foreground */
  roi?: ROI;

  /** Enable semi-transparency for soft edges */
  semitransparency?: boolean;

  /** Shadow type to add */
  shadow_type?: ShadowType;

  /** Shadow opacity (0-100) */
  shadow_opacity?: number;

  /** @deprecated Use shadow_type instead - Add shadow to result (for cars) */
  add_shadow?: boolean;
}

/**
 * Parameters for removing background from image file upload
 */
export interface RemoveBackgroundFromFileParams
  extends RemoveBackgroundBaseParams {
  /** Image file to upload (File, Blob, or Buffer) */
  image_file: File | Blob | Buffer;
}

/**
 * Parameters for removing background from image URL
 */
export interface RemoveBackgroundFromUrlParams
  extends RemoveBackgroundBaseParams {
  /** URL of the image to process */
  image_url: string;
}

/**
 * Parameters for removing background from base64 encoded image
 */
export interface RemoveBackgroundFromBase64Params
  extends RemoveBackgroundBaseParams {
  /** Base64 encoded image data */
  image_file_b64: string;
}

/**
 * Union type for all background removal parameters
 */
export type RemoveBackgroundParams =
  | RemoveBackgroundFromFileParams
  | RemoveBackgroundFromUrlParams
  | RemoveBackgroundFromBase64Params;

// ============================================
// Response Types
// ============================================

/**
 * Detected foreground type in response
 */
export type DetectedType =
  | "person"
  | "product"
  | "animal"
  | "car"
  | "transportation"
  | "graphic"
  | "other";

/**
 * Credits information
 */
export interface Credits {
  /** Total available credits */
  total: number;

  /** Credits from subscription */
  subscription: number;

  /** Pay-as-you-go credits */
  payg: number;
}

/**
 * API information
 */
export interface ApiInfo {
  /** Number of free API calls available */
  free_calls: number;

  /** Available image sizes */
  sizes: string;
}

/**
 * Account information response
 */
export interface AccountInfo {
  data: {
    attributes: {
      /** Credits information */
      credits: Credits;

      /** API access information */
      api: ApiInfo;

      /** Enterprise credits (if applicable) */
      enterprise?: number;
    };
  };
  errors: [{ title: string }];
}

/**
 * Foreground position and size information
 */
export interface ForegroundInfo {
  /** Top position of foreground bounding box */
  foreground_top: number;

  /** Left position of foreground bounding box */
  foreground_left: number;

  /** Width of foreground bounding box */
  foreground_width: number;

  /** Height of foreground bounding box */
  foreground_height: number;
}

/**
 * Background removal success response
 */
export interface RemoveBackgroundResult {
  /** Base64 encoded result image (if not saving to file) */
  base64img?: string;

  /** Raw image data as Buffer */
  data?: Buffer;

  /** Detected foreground type */
  detectedType: DetectedType;

  /** Width of result image */
  resultWidth: number;

  /** Height of result image */
  resultHeight: number;

  /** Number of credits charged */
  creditsCharged: number;

  /** Rate limit information */
  rateLimit: {
    /** Total rate limit per minute */
    limit: number;

    /** Remaining requests for this minute */
    remaining: number;

    /** Unix timestamp when rate limit resets */
    reset: number;

    /** Seconds until rate limit resets (only if limit exceeded) */
    retryAfter?: number;
  };

  /** Foreground position and size */
  foreground: ForegroundInfo;
}

// ============================================
// Error Types
// ============================================

/**
 * API error code types
 */
export type ErrorCode =
  | "missing_api_key"
  | "invalid_api_key"
  | "insufficient_credits"
  | "rate_limit_exceeded"
  | "invalid_image"
  | "invalid_parameters"
  | "file_size_exceeded"
  | "resolution_exceeded"
  | "internal_error";

/**
 * Individual error object
 */
export interface RemoveBackgroundError {
  /** Error title/code */
  title: string;

  /** Detailed error message */
  detail?: string;

  /** Error code */
  code?: ErrorCode;
}

/**
 * Error response from API
 */
export interface RemoveBackgroundErrorResponse {
  /** Array of errors */
  errors: RemoveBackgroundError[];
}

// ============================================
// HTTP Headers
// ============================================

/**
 * Request headers
 */
export interface RequestHeaders {
  /** API key for authentication */
  "X-Api-Key": string;

  /** Optional custom headers */
  [key: string]: string;
}

/**
 * Response headers
 */
export interface ResponseHeaders {
  /** Detected foreground type */
  "X-Type": DetectedType;

  /** Width of result image */
  "X-Width": string;

  /** Height of result image */
  "X-Height": string;

  /** Credits charged for this request */
  "X-Credits-Charged": string;

  /** Total rate limit per minute */
  "X-RateLimit-Limit": string;

  /** Remaining requests for this minute */
  "X-RateLimit-Remaining": string;

  /** Unix timestamp when rate limit resets */
  "X-RateLimit-Reset": string;

  /** Seconds to wait before retrying (only if rate limited) */
  "Retry-After"?: string;

  /** Foreground top position */
  "X-Foreground-Top": string;

  /** Foreground left position */
  "X-Foreground-Left": string;

  /** Foreground width */
  "X-Foreground-Width": string;

  /** Foreground height */
  "X-Foreground-Height": string;
}

// ============================================
// API Client Interface
// ============================================

/**
 * Remove.bg API client configuration
 */
export interface RemoveBgClientConfig {
  /** API key */
  apiKey: string;

  /** Base URL (default: https://api.remove.bg/v1.0) */
  baseUrl?: string;

  /** Request timeout in milliseconds */
  timeout?: number;
}

/**
 * Remove.bg API client interface
 */
export interface RemoveBgClient {
  /**
   * Remove background from an image
   */
  removeBackground(
    params: RemoveBackgroundParams
  ): Promise<RemoveBackgroundResult>;

  /**
   * Get account information
   */
  getAccount(): Promise<AccountInfo>;
}

// ============================================
// Utility Types
// ============================================

/**
 * Options for saving result to file
 */
export interface SaveOptions {
  /** Path to save the file */
  outputFile: string;
}

/**
 * Full parameters with save option
 */
export type RemoveBackgroundParamsWithSave = RemoveBackgroundParams &
  SaveOptions;

export class RemoveBgClient implements RemoveBgClient {
  removeBackground(
    params: RemoveBackgroundParams
  ): Promise<RemoveBackgroundResult> {
    return new Promise((resolve, reject) => {
      Taro.request({
        url: "https://api.remove.bg/v1.0/removebg",
        header: {
          "X-API-Key": TARO_APP_SECRET_KEY,
          "Content-Type": "multipart/form-data",
        },
        data: params,
        success: (res) => {
          if (res.statusCode === 400) {
            Taro.showToast({ title: "无效参数，请联系开发者", icon: 'error' });
            return;
          }

          if (res.statusCode === 402) {
            Taro.showToast({ title: "积分不足，请联系开发者", icon: 'error' });
            return;
          }

          if (res.statusCode === 403) {
            Taro.showToast({ title: "权限验证失败，请联系开发者", icon: 'error' });
            return;
          }

          if (res.statusCode === 429) {
            Taro.showToast({ title: "操作频繁，超过速率限制", icon: 'error' });
          }
          resolve(res.data);
        },
        fail: reject,
      });
    });
  }

  getAccount(): Promise<AccountInfo> {
    return new Promise((resolve, reject) => {
      Taro.request({
        url: "https://api.remove.bg/v1.0/account",
        header: {
          "X-API-Key": TARO_APP_SECRET_KEY,
        },
        success: (res) => {
          if (res.statusCode === 403) {
            Taro.showToast({ title: "权限验证失败，请联系开发者", icon: 'error' });
            return;
          }

          if (res.statusCode === 429) {
            Taro.showToast({ title: "操作频繁，超过速率限制", icon: 'error' });
          }
          resolve(res.data);
        },
        fail: reject,
      });
    });
  }
}
