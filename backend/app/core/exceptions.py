class AppError(Exception):
    """Base exception for all application-specific errors."""


class NotFoundError(AppError):
    """Requested resource was not found."""


class PermissionDeniedError(AppError):
    """User is not allowed to perform this action."""


class AlreadyExistsError(AppError):
    """Resource with the same unique data already exists."""


class InvalidOperationError(AppError):
    """Operation cannot be performed in the current state."""
