import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function AuthControls() {
  const { identity, login, clear, isLoggingIn, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (identity) {
    const principal = identity.getPrincipal().toString();
    const shortPrincipal = `${principal.slice(0, 6)}...${principal.slice(-4)}`;

    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="font-mono text-xs">
          {shortPrincipal}
        </Badge>
        <Button variant="outline" size="sm" onClick={clear}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="default"
      size="sm"
      onClick={login}
      disabled={isLoggingIn}
    >
      {isLoggingIn ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Signing In...
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </>
      )}
    </Button>
  );
}
