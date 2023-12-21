import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { Theme } from "@/lib/theme";
import { Check, Copy } from "lucide-react";
import React, { useEffect } from "react";
import hljs from "highlight.js";
import 'highlight.js/styles/github-dark.css';

const CodeBlock = ({ className, children }: { className: string, children: string }) => {
  const [copied, setCopied] = React.useState(false);
  const code = children.trim();
  let lang = 'plaintext'; // default to plaintext
  if (className && className.startsWith('lang-')) {
    lang = className.replace('lang-', '');
  }

  useEffect(() => {
    document.querySelectorAll("pre code").forEach(block => {
      hljs.highlightBlock(block as HTMLElement);
    });
  }, []);

  // Rest of your component code remains the same
  // ...

  return (
    <div className="code-block rounded-sm my-2 hljs relative">
      <pre><code className={lang}>{code}</code></pre>
      <div className="clipboard-button absolute right-2 top-2 h-12">
        <Button variant={'secondary'} size={'icon'} className="h-8 w-8 rounded-sm bg-secondary/10 backdrop-blur-xl" asChild onClick={
          () => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 1000);
          }
        }>
          <div>
            {
              copied ? (
                <TooltipProvider>
                  <Tooltip open>
                    <TooltipTrigger>
                      <Check className="h-4 w-4" stroke="#16a34a" />
                      <span className="sr-only">Copied!</span>
                    </TooltipTrigger>
                    <TooltipContent className="!bg-popover/75 !backdrop-blur-sm" align="end">
                      Copied!
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <>
                  <Copy className="h-4 w-4" strokeWidth={1.75} />
                  <span className="sr-only">Copy</span>
                </>
              )
            }
          </div>
        </Button>
      </div>
    </div>
  );
};


type PreBlockProps = {
  children: React.ReactNode,
  [key: string]: any,
};

export const PreBlock: React.FC<PreBlockProps> = ({ children, ...rest }) => {
  if (React.isValidElement(children) && children.type === 'code') {
    return CodeBlock(children.props);
  }
  return <pre {...rest}>{children}</pre>;
};

