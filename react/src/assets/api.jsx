export const BACKEND_BASE_URL = 'http://localhost:8000'

export const LOGIN_API = `${BACKEND_BASE_URL}/api/login`

export const PERSON_SEARCH_API = `${BACKEND_BASE_URL}/api/person/search`
export const PERSON_FAMILY_TREE_API = `${BACKEND_BASE_URL}/api/family/persons`
export const PERSON_DETAIL_API = `${BACKEND_BASE_URL}/api/person/detail`

export const PERSON_LIST_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/person`
export const PERSON_DETAIL_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/person`
export const PERSON_UPDATE_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/person/update`
export const HEAD_FAMILY_LIST_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/headfamily`
export const PERSON_FAMILY_LIST_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/family/list`
export const FAMILY_LIST_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/family`
export const ASSIGN_PERSON_RELATION_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/person/relation/add`
export const PERSON_DELETE_ADMIN_API = `${BACKEND_BASE_URL}/api/admin/person/delete`

export const ADMIN_SEARCH_REFERRAL_API = `${BACKEND_BASE_URL}/api/admin/referral/search`
export const ADMIN_INVALIDATE_REFERRAL_API = `${BACKEND_BASE_URL}/api/admin/referral/invalidate`
export const ADMIN_CREATE_REFERRAL_API = `${BACKEND_BASE_URL}/api/admin/referral/create`