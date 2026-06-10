from flask import jsonify


def success_response(data=None, message: str = "OK", status: int = 200):
    return jsonify({"success": True, "message": message, "data": data}), status


def error_response(message: str, status: int = 400, errors=None):
    payload = {"success": False, "message": message}
    if errors:
        payload["errors"] = errors
    return jsonify(payload), status


def paginated_response(items, total: int, page: int, per_page: int):
    return jsonify({
        "success": True,
        "data": items,
        "pagination": {
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": (total + per_page - 1) // per_page,
        },
    }), 200
