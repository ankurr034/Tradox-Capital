export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  let timer: NodeJS.Timeout;
  
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      const sendUpdate = () => {
        // Generate some mock price updates for major symbols
        const symbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'];
        const updates = symbols.map(sym => ({
          symbol: sym,
          price: +(Math.random() * 1000 + 1000).toFixed(2),
          change: +(Math.random() * 10 - 5).toFixed(2)
        }));
        
        const data = `data: ${JSON.stringify(updates)}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      // Send initial data immediately
      sendUpdate();

      // Stream updates every 3 seconds
      timer = setInterval(sendUpdate, 3000);
    },
    cancel() {
      clearInterval(timer);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
