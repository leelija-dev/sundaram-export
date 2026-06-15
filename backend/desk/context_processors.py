def desk_alerts(request):
    if not request.user.is_authenticated:
        return {}
    if not (request.user.is_staff or request.user.is_superuser):
        return {}
    if not request.path.startswith("/desk"):
        return {}

    from inquiries.models import Inquiry

    new_count = Inquiry.objects.filter(status=Inquiry.Status.NEW).count()
    return {"desk_new_inquiries": new_count}
