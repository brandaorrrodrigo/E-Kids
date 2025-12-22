#!/usr/bin/env python3
"""
Edge TTS Generator para E-Kids PRO
Gera áudio usando Microsoft Edge TTS (vozes neurais pt-BR)
"""

import asyncio
import sys
import edge_tts

# Voz padrão: Leticia (curiosa e alegre - perfeita para crianças!)
DEFAULT_VOICE = "pt-BR-LeticiaNeural"

async def generate_audio(text, output_file, voice=DEFAULT_VOICE):
    """Gera áudio a partir de texto usando Edge TTS"""
    try:
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_file)
        print(f"✅ Áudio gerado: {output_file}")
        return True
    except Exception as e:
        print(f"❌ Erro ao gerar áudio: {e}", file=sys.stderr)
        return False

def main():
    if len(sys.argv) < 3:
        print("Uso: python edge-tts-generate.py <texto> <arquivo_saida> [voz]")
        print(f"Voz padrão: {DEFAULT_VOICE}")
        sys.exit(1)

    text = sys.argv[1]
    output_file = sys.argv[2]
    voice = sys.argv[3] if len(sys.argv) > 3 else DEFAULT_VOICE

    success = asyncio.run(generate_audio(text, output_file, voice))
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
