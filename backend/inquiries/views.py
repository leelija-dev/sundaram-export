import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .emails import send_inquiry_notification
from .serializers import InquiryCreateSerializer, InquiryResponseSerializer
from .throttles import InquiryCreateThrottle

logger = logging.getLogger(__name__)


class InquiryCreateView(APIView):
    throttle_classes = [InquiryCreateThrottle]

    def post(self, request):
        serializer = InquiryCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()
        try:
            send_inquiry_notification(inquiry)
        except Exception as exc:
            logger.exception(
                "Inquiry %s saved but admin email failed: %s. Check desk → Inquiries.",
                inquiry.id,
                exc,
            )
        return Response(
            {
                "id": str(inquiry.id),
                "message": "Thank you. Our export desk will respond within one business day.",
                "inquiry": InquiryResponseSerializer(inquiry).data,
            },
            status=status.HTTP_201_CREATED,
        )
