let BASE_URL = 'http://localhost:8000/api/';

const urls={
    "login": BASE_URL + "login/",
    "get_user":BASE_URL + "user/",
    "get_user_projs":BASE_URL + "user_projs/",
    "get_user_skills":BASE_URL + "user_skills/",
    "get_all_emp":BASE_URL +"emps_view/",
    "get_emp_skills":BASE_URL + "emp_skills/",
    "get_proj_skills":BASE_URL+"proj_skills/",
    "create_proj":BASE_URL + "proj_view/",
    "get_skills":BASE_URL +"skills/",
    "get_suggested_emp":BASE_URL + "sug_emps/",
    "get_deigsnations" : BASE_URL + "des/",
    "get_emps_in_proj" : BASE_URL + "emps_in_proj/",
    "check_proj_alloc":BASE_URL +"check_proj_alloc/",
    "get_notifications":BASE_URL + "get_notifications/",
    "req_skill":BASE_URL+"req_skill",
}

export default urls;