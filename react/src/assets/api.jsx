let BaseURL = 'http://localhost:8000'
if (import.meta.env.VITE_APP_ENV == "prod") {
    BaseURL = 'https://api.pohonkeluarga.id'
}
export const BACKEND_BASE_URL = BaseURL

export const LOGIN_API = `${BACKEND_BASE_URL}/api/login`

export const PERSON_SEARCH_API = `${BACKEND_BASE_URL}/api/person/search`
export const PERSON_FAMILY_TREE_API = `${BACKEND_BASE_URL}/api/family/persons`
export const PERSON_DETAIL_API = `${BACKEND_BASE_URL}/api/person/detail`

export const PERSON_LIST_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/person`
export const PERSON_DETAIL_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/person`
export const PERSON_UPDATE_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/person/update`
export const HEAD_FAMILY_LIST_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/headfamily`
export const ASSIGN_PERSON_RELATION_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/person/relation/add`
export const PERSON_DELETE_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/person/delete`
export const NEW_FAMILY_PERSON_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/new/family-person`
export const ADMIN_GALLERY_LIST = `${BACKEND_BASE_URL}/api/gallery/list`
export const ADMIN_GALLERY_PHOTOS_LIST = `${BACKEND_BASE_URL}/api/gallery/detail`
export const ADMIN_PHOTOS_LIST = `${BACKEND_BASE_URL}/api/person/photos/list`
export const ADMIN_PHOTOS_ADD = `${BACKEND_BASE_URL}/api/gallery/photos/add`

export const ADMIN_UPLOAD_PHOTOS = `${BACKEND_BASE_URL}/api/photo/upload`

export const PERSON_FAMILY_LIST_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/family/list`
export const FAMILY_LIST_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/family`
export const FAMILY_CREATE_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/family/create`
export const FAMILY_ASSIGN_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/family/assign`

export const ADMIN_SEARCH_REFERRAL_API = `${BACKEND_BASE_URL}/api/admin/referral/search`
export const ADMIN_INVALIDATE_REFERRAL_API = `${BACKEND_BASE_URL}/api/admin/referral/invalidate`
export const ADMIN_CREATE_REFERRAL_API = `${BACKEND_BASE_URL}/api/admin/referral/create`

// API for Guest
export const GUEST_FAMILY_LIST_API = `${BACKEND_BASE_URL}/api/guest/family/person`
export const GUEST_CHECK = `${BACKEND_BASE_URL}/api/guest/check`