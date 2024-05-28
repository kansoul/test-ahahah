export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Lỗi xác thực',
  NAME_IS_REQUIRED: 'Tên là bắt buộc',
  NAME_MUST_BE_A_STRING: 'Tên phải là một chuỗi',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Độ dài tên phải từ 1 đến 100 ký tự',
  EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  EMAIL_IS_REQUIRED: 'Email là bắt buộc',
  EMAIL_IS_INVALID: 'Email không hợp lệ',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email hoặc mật khẩu không chính xác',
  PASSWORD_IS_REQUIRED: 'Mật khẩu là bắt buộc',
  PASSWORD_MUST_BE_A_STRING: 'Mật khẩu phải là một chuỗi',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Độ dài mật khẩu phải từ 6 đến 50 ký tự',
  PASSWORD_MUST_BE_STRONG:
    'Mật khẩu phải từ 6-50 ký tự và chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Xác nhận mật khẩu là bắt buộc',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Xác nhận mật khẩu phải là một chuỗi',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Độ dài xác nhận mật khẩu phải từ 6 đến 50 ký tự',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Xác nhận mật khẩu phải từ 6-50 ký tự và chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Xác nhận mật khẩu phải trùng với mật khẩu',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Ngày sinh phải theo định dạng ISO8601',
  DATE_OF_BIRTH_IS_REQUIRED: 'Ngày sinh là bắt buộc',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  REGISTER_SUCCESS: 'Đăng ký thành công',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token là bắt buộc',
  ACCESS_TOKEN_IS_EXPIRED: 'Access token đã hết hạn',
  RESET_PASSWORD_SUCCESS: 'Đặt lại mật khẩu thành công',
  GET_ME_SUCCESS: 'Lấy thông tin cá nhân thành công',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token là bắt buộc',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email đã được xác thực trước đó',
  EMAIL_VERIFY_SUCCESS: 'Xác thực email thành công',
  CHANGE_PASSWORD_NOT_SUCCESSFULLY: 'Thay đổi mật khẩu không thành công',
  INCORRECT_OLD_PASSWORD: 'Vui lòng nhập đúng mật khẩu hiện tại của bạn',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Gửi lại email xác thực thành công',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Kiểm tra email để đặt lại mật khẩu',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token là bắt buộc',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Xác thực forgot password thành công',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Forgot password token không hợp lệ',
  PHONE_NUMBER: 'Số điện thoại phải từ 10 đến 11 số',
  INCORRECT_PASSWORD: 'Mật khẩu không chính xác',
  USER_NOT_VERIFIED: 'Người dùng chưa được xác thực',
  UPLOAD_SUCCESS: 'Tải lên thành công',
  PARTICIPANT_REQUIRED: 'Hãy gửi chỉ định danh sách người chấp nhận tham gia',
  APPOINTMENT_REQUIRED: 'Hãy chỉ định cuôc hẹn'
} as const

export const ADDRESS_MESSAGES = {
  INITIALIZE_PROVINCES_FAILED: 'Khởi tạo tỉnh/thành phố thất bại',
  INITIALIZE_DISTRICTS_FAILED: 'Khởi tạo quận/huyện thất bại',
  INITIALIZE_WARDS_FAILED: 'Khởi tạo xã/phường thất bại',

  PROVINCE_NOT_EXIST: 'Tỉnh/thành phố chỉ định không tồn tại',
  PROVINCE_CODE_IS_REQUIRED: 'Vui lòng chỉ định mã tỉnh/thành phố',

  DISTRICT_NOT_EXIST: 'Quận/huyện chỉ định không tồn tại',
  DISTRICT_CODE_IS_REQUIRED: 'Vui lòng chỉ định mã quận/huyện'
} as const

export const COMMON_MESSAGES = {
  SOMETHING_WENT_WRONG: 'Đã xảy ra lỗi'
} as const

export const CATEGORIES_MESSAGES = {
  NOT_FOUND: 'Danh mục không tồn tại',
  NAME_IS_REQUIRED: 'Tên danh mục là bắt buộc',
  INVALID_NAME: 'Tên danh mục không hợp lệ',
  INVALID_DESCRIPTION: 'Mô tả danh mục không hợp lệ',
  EXIST: 'Danh mục đã tồn tại',
  CATEGORY_ID_IS_REQUIRED: 'Cần chỉ định id danh mục'
} as const

export const ARTICLE_MESSAGES = {
  NOT_FOUND: 'Bài viết không tồn tại',
  TITLE_IS_REQUIRED: 'Tiêu đề bài viết là bắt buộc',
  INVALID_TITLE: 'Tiêu đề bài viết phải là chuỗi',

  CONTENT_IS_REQUIRED: 'Nội dung bài viết là bắt buộc',
  INVALID_CONTENT: 'Nội dung bài viết phải là chuỗi',
  INVALID_ADDRESS: 'Địa chỉ bài viết phải là chuỗi',

  INVALID_ANTICIPATED_PRICE: 'Giá tiền phải là số',
  INVALID_BANNERS: 'Banners không hợp lệ',
  INVALID_CATEGORIES: 'Danh mục không hợp lệ',
  CATEGORIES_IS_REQUIRED: 'Danh mục là bắt buộc',

  INVALID_NAME: 'Tên danh mục không hợp lệ',
  INVALID_DESCRIPTION: 'Mô tả danh mục không hợp lệ',
  EXIST: 'Danh mục đã tồn tại',
  CATEGORY_ID_IS_REQUIRED: 'Cần chỉ định id danh mục',

  APPOINTMENT: {
    TITLE_REQUIRED: 'Vui lòng nhập tiêu đề',
    DATE_REQUIRED: 'Vui lòng nhập ngày dự kiến',
    PROVINCE_REQUIRED: 'Vui lòng nhập tỉnh/thành phố',
    DISTRICT_REQUIRED: 'Vui lòng nhập quận/huyện',
    WARD_REQUIRED: 'Vui lòng nhập xã/phường',
    INVALID_ANTICIPATED_PRICE_REQUIRED: 'Vui lòng nhập giá tiền hợp lệ',
    EMAIL_PARTICIPANT_REQUIRED: 'Vui lòng nhập email của người tham gia hợp lệ',
    INVALID_FEEDBACK: 'Vui lòng nhập hình ảnh hợp lệ'
  }
} as const

export const APPOINTMENT_MESSAGES = {
  NOT_FOUND: 'Không tìm thấy bài viết',
  INVALID_ORGANIZER: 'Bạn không phải là người tạo kèo này'
} as const

export const FAVORITE_MESSAGE = {
  EXIST: 'Bài viết này đã được thêm vào danh sách yêu thích trước đó',
  NOT_FOUND: 'Không tìm thấy bài viết này'
}

export const COMMENT_MESSAGE = {
  NOT_FOUND_ARTICLE: 'Không tìm thấy bài viết này'
}
