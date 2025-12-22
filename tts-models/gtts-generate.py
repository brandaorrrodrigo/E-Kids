#!/usr/bin/env python3
"""
Google TTS Generator para E-Kids PRO
Gera áudio usando Google Text-to-Speech (voz feminina pt-BR)
"""

import sys
from gtts import gTTS

def generate_audio(text, output_file):
    """Gera áudio a partir de texto usando Google TTS"""
    try:
        # Criar TTS com voz feminina pt-BR
        # gTTS usa vozes femininas por padrão em pt-BR
        tts = gTTS(text=text, lang='pt-br', slow=False)
        tts.save(output_file)
        print(f"Audio gerado: {output_file}")
        return True
    except Exception as e:
        print(f"Erro ao gerar audio: {e}", file=sys.stderr)
        return False

def main():
    if len(sys.argv) < 3:
        print("Uso: python gtts-generate.py <texto> <arquivo_saida>")
        sys.exit(1)

    text = sys.argv[1]
    output_file = sys.argv[2]

    success = generate_audio(text, output_file)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
