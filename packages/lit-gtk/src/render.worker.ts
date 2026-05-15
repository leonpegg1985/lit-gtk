
/**
 * Rendering worker that handles all canvas drawing operations off-screen.
 * This keeps the main thread responsive even during complex redraws.
 */

type WidgetType = 'button' | 'switch' | 'label' | 'progress-bar' | 'header-bar' | 'checkbox' | 'separator' | 'entry' | 'box';

interface RenderRequest {
  id: string;
  type: WidgetType;
  props: any;
  theme: any;
  width: number;
  height: number;
}

const canvases = new Map<string, OffscreenCanvas>();

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'REGISTER_CANVAS') {
    const { id, canvas } = payload;
    canvases.set(id, canvas);
  } else if (type === 'RENDER') {
    renderWidget(payload as RenderRequest);
  } else if (type === 'RESIZE') {
    const { id, width, height } = payload;
    const canvas = canvases.get(id);
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
    }
  }
};

function renderWidget(req: RenderRequest) {
  const canvas = canvases.get(req.id);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { type, props, theme, width, height } = req;
  ctx.clearRect(0, 0, width, height);

  switch (type) {
    case 'button':
      drawButton(ctx, props, theme, width, height);
      break;
    case 'switch':
      drawSwitch(ctx, props, theme, width, height);
      break;
    case 'label':
      drawLabel(ctx, props, theme, width, height);
      break;
    case 'progress-bar':
      drawProgressBar(ctx, props, theme, width, height);
      break;
    case 'checkbox':
      drawCheckbox(ctx, props, theme, width, height);
      break;
    case 'separator':
      drawSeparator(ctx, props, theme, width, height);
      break;
    case 'entry':
      drawEntry(ctx, props, theme, width, height);
      break;
    case 'box':
      drawBox(ctx, props, theme, width, height);
      break;
  }
}

function drawRoundedRect(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawButton(ctx: OffscreenCanvasRenderingContext2D, props: any, theme: any, w: number, h: number) {
  const radius = 6;
  ctx.save();
  
  const isSuggested = props.suggested || props.variant === 'suggested';
  const isDestructive = props.destructive || props.variant === 'destructive';
  const isFlat = props.variant === 'flat';
  const isOutline = props.variant === 'outline';
  
  // Background
  if (!isFlat && !isOutline) {
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    if (isSuggested) {
      gradient.addColorStop(0, '#4a90e2');
      gradient.addColorStop(1, '#3584e4');
      ctx.fillStyle = gradient;
    } else if (isDestructive) {
      gradient.addColorStop(0, '#f2484f');
      gradient.addColorStop(1, '#e01b24');
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = props.active ? theme.buttonActiveBg : theme.buttonBg;
    }
    
    drawRoundedRect(ctx, 0.5, 0.5, w - 1, h - 1, radius);
    ctx.fill();
    
    // Shine effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  } else if (props.active) {
    ctx.fillStyle = theme.buttonActiveBg;
    drawRoundedRect(ctx, 0.5, 0.5, w - 1, h - 1, radius);
    ctx.fill();
  } else if (isOutline) {
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, 0.5, 0.5, w - 1, h - 1, radius);
    ctx.stroke();
  }
  
  // Border for normal buttons
  if (!isFlat && !isSuggested && !isDestructive && !isOutline) {
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, 0.5, 0.5, w - 1, h - 1, radius);
    ctx.stroke();
  }

  // Text/Label
  ctx.fillStyle = (isSuggested || isDestructive) ? 'white' : theme.buttonFg;
  ctx.font = '500 13px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif';
  ctx.textBaseline = 'middle';
  
  const label = props.label || '';
  const icon = props.icon;
  
  if (icon) {
    const textMetrics = ctx.measureText(label);
    const iconWidth = 16;
    const spacing = 6;
    const totalWidth = iconWidth + spacing + textMetrics.width;
    const startX = (w - totalWidth) / 2;
    
    ctx.textAlign = 'left';
    ctx.fillText(icon, startX, h / 2);
    ctx.fillText(label, startX + iconWidth + spacing, h / 2);
  } else {
    ctx.textAlign = 'center';
    ctx.fillText(label, w / 2, h / 2);
  }

  ctx.restore();
}

function drawSwitch(ctx: OffscreenCanvasRenderingContext2D, props: any, theme: any, w: number, h: number) {
  const active = props.active;
  ctx.save();
  
  // Trough
  ctx.fillStyle = active ? theme.switchActiveBg : theme.switchBg;
  drawRoundedRect(ctx, 0, 0, w, h, h / 2);
  ctx.fill();

  // Highlight border for active state
  if (active) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Knob
  const knobPadding = 2;
  const knobSize = h - (knobPadding * 2);
  const knobX = active ? (w - knobSize - knobPadding) : knobPadding;
  
  // Knob Shadow
  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;
  
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(knobX + knobSize / 2, h / 2, knobSize / 2, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

function drawLabel(ctx: OffscreenCanvasRenderingContext2D, props: any, theme: any, w: number, h: number) {
  ctx.fillStyle = theme.buttonFg;
  const fontWeight = props.bold ? '600' : '400';
  const fontSize = props.isTitle ? '18px' : '13px';
  ctx.font = `${fontWeight} ${fontSize} system-ui`;
  ctx.textAlign = props.align || 'left';
  ctx.textBaseline = 'middle';
  
  const x = ctx.textAlign === 'center' ? w / 2 : (ctx.textAlign === 'right' ? w : 0);
  ctx.fillText(props.text || '', x, h / 2);
}

function drawProgressBar(ctx: OffscreenCanvasRenderingContext2D, props: any, theme: any, w: number, h: number) {
  ctx.save();
  
  // Trough
  ctx.fillStyle = theme.switchBg;
  drawRoundedRect(ctx, 0, 0, w, h, h / 2);
  ctx.fill();

  // Progress
  const fraction = Math.min(1, Math.max(0, props.fraction || 0));
  if (fraction > 0) {
    ctx.fillStyle = theme.accentBg;
    drawRoundedRect(ctx, 0, 0, w * fraction, h, h / 2);
    ctx.fill();
    
    // Subtle gradient on progress
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.05)');
    ctx.fillStyle = gradient;
    drawRoundedRect(ctx, 0, 0, w * fraction, h, h / 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawCheckbox(ctx: OffscreenCanvasRenderingContext2D, props: any, theme: any, w: number, h: number) {
  ctx.save();
  const active = props.active;
  const radius = 4;
  const size = 18;
  const x = (w - size) / 2;
  const y = (h - size) / 2;

  if (active) {
    ctx.fillStyle = theme.accentBg;
    drawRoundedRect(ctx, x, y, size, size, radius);
    ctx.fill();

    // Checkmark
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 10);
    ctx.lineTo(x + 8, y + 14);
    ctx.lineTo(x + 14, y + 6);
    ctx.stroke();
  } else {
    ctx.fillStyle = theme.buttonBg;
    drawRoundedRect(ctx, x, y, size, size, radius);
    ctx.fill();
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();
}

function drawSeparator(ctx: OffscreenCanvasRenderingContext2D, props: any, theme: any, w: number, h: number) {
  ctx.fillStyle = theme.borderColor;
  if (props.orientation === 'vertical') {
    ctx.fillRect((w - 1) / 2, 0, 1, h);
  } else {
    ctx.fillRect(0, (h - 1) / 2, w, 1);
  }
}

function drawEntry(ctx: OffscreenCanvasRenderingContext2D, props: any, theme: any, w: number, h: number) {
  const radius = 6;
  ctx.save();
  
  // Background
  ctx.fillStyle = theme.windowBg;
  drawRoundedRect(ctx, 0.5, 0.5, w - 1, h - 1, radius);
  ctx.fill();
  
  // Border
  ctx.strokeStyle = props.focused ? theme.accentBg : theme.borderColor;
  ctx.lineWidth = props.focused ? 2 : 1;
  drawRoundedRect(ctx, 0.5, 0.5, w - 1, h - 1, radius);
  ctx.stroke();

  ctx.restore();
}

function drawBox(ctx: OffscreenCanvasRenderingContext2D, props: any, theme: any, w: number, h: number) {
  // Empty for now, but could handle drawing backgrounds or borders for containers
}
