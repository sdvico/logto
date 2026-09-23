const components = {
  uploader: {
    action_description: 'Kéo thả hoặc chọn tệp',
    uploading: 'Đang tải lên...',
    image_limit:
      'Tải ảnh dưới {{size, number}}KB, chỉ chấp nhận {{extensions, list(style: narrow; type: conjunction;)}}.',
    error_upload: 'Đã có lỗi xảy ra. Tải tệp lên thất bại.',
    error_file_size: 'Kích thước tệp quá lớn. Vui lòng tải tệp dưới {{limitWithUnit}}.',
    error_file_type:
      'Loại tệp không được hỗ trợ. Chỉ chấp nhận {{extensions, list(style: narrow; type: conjunction;)}}.',
    error_file_count: 'Bạn chỉ có thể tải lên 1 tệp.',
  },
};

export default Object.freeze(components);
