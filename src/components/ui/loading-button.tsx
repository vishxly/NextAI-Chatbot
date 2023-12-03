import { Loader2 } from "lucide-react"
import { Button, ButtonProps } from "./button"

type LoadingButtonProps = {
    loading: boolean
} & ButtonProps

export default function LoadingButton({
    children,
    loading,
    ...props
}: LoadingButtonProps) {
    return(
        <Button>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </Button>
    );

}