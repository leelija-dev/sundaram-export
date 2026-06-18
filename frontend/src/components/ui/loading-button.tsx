import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

type LoadingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingLabel?: string;
};

export function LoadingButton({
  loading = false,
  loadingLabel,
  children,
  className,
  disabled,
  type = "button",
  ...props
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      className={cn("inline-flex items-center justify-center gap-2", className)}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="sm" className="text-current" />
          <span>{loadingLabel ?? children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
