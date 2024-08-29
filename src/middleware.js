const middleLogic = pathname => {
    if (pathname == "/" && admin_cookie){
        navigate('/admin-dashboard')
    }else if (pathname !== "/" && !admin_cookie){
        navigate("/")
    }
}