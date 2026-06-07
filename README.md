# Padronizador de Nomes de Arquivo

> 🇺🇸 [English version → README.en.md](README.en.md)

A lightweight, zero-dependency web utility that converts messy titles into clean, standardized file names in one click.

---

## Por que isso existe

Se você já trabalhou com arquivos acadêmicos, projetos de código ou qualquer coisa onde o nome do arquivo importa, sabe a dor: você tem um título como **"Aplicação de Integrais e Transformada de Fourier na Transcrição Automática de Áudio para Partitura"** e precisa transformá-lo em algo que o sistema operacional, o terminal e o Git não vão odiar.

Fazer na mão é chato. Você remove os acentos, troca os espaços por underscores, joga tudo em minúsculo — e inevitavelmente erra alguma coisa ou esquece um `ã`. Pedir pra uma LLM fazer também cansa: abrir uma janela nova, digitar o pedido, copiar o resultado... toda vez a mesma coisa, pra uma tarefa que deveria ser mecânica.

A inspiração veio de ferramentas como o **[Convert Case](https://convertcase.net/)** — simples, diretas, sem frescura. Você cola o texto, escolhe o formato, copia. Sem cadastro, sem anúncio, sem carregamento. Essa ferramenta segue a mesma filosofia, mas focada especificamente no problema de nomear arquivos.

---

## Como usar

Sem instalação. Abra `padronizador_nomes.html` direto no navegador.

```
Abrir padronizador_nomes.html → colar o título → escolher o formato → copiar
```

---

## Formatos de saída

| Formato | Descrição | Exemplo |
|---|---|---|
| **Completa** | Todas as palavras, sem omissões | `aplicacao_de_integrais_e_transformada_de_fourier` |
| **Resumida** | Remove artigos e preposições | `aplicacao_integrais_transformada_fourier` |
| **Compacta** | Máximo de 5 palavras-chave | `aplicacao_integrais_transformada_fourier_transcricao` |
| **Abreviada** | Trunca cada palavra a 4 caracteres | `apli_inte_tran_four_tran` |

---

## Opções extras

- **Timestamp** — prefixo com a data atual no formato `YYYYMMDD`
- **Maiúsculas** — converte toda a saída para caixa alta
- **Hífens** — usa `-` em vez de `_` como separador

Combinações são livres. Por exemplo, timestamp + hífens + compacta geram:

```
20250607-aplicacao-integrais-transformada-fourier-transcricao
```

---

## Funcionalidades da interface

- **Aba "Resultado"** — nome gerado no formato selecionado com botão de copiar
- **Aba "Todas as versões"** — exibe os 4 formatos simultaneamente, cada um com cópia individual
- **Histórico** — últimas 30 conversões salvas no `localStorage`, persistindo entre sessões
- **Restaurar do histórico** — clicar em um item preenche o título e o modo de volta no formulário
- **Tema escuro / claro** — alternável pelo botão fixo no canto superior direito, preferência salva

---

## Arquitetura do código

O JavaScript é organizado em módulos de responsabilidade única (princípio SRP do SOLID), sem dependências externas:

```
TextNormalizer          remove acentos e caracteres especiais
StopWords               gerencia e filtra artigos e preposições em português
ConversionStrategies    objeto com as 4 estratégias de conversão (OCP)
OutputFormatter         formata a saída final (separador, caixa, timestamp)
convert()               orquestra o pipeline sem lógica própria
```

Adicionar um novo formato é tão simples quanto adicionar uma chave ao objeto `ConversionStrategies` — sem tocar no restante do código.

---

## Tecnologias

- HTML5 · CSS3 com variáveis customizadas · JavaScript ES6+ vanilla
- Google Fonts: JetBrains Mono + Syne
- `localStorage` para persistência de histórico e preferência de tema
- Zero dependências externas, zero build step

---

## Estrutura do projeto

```
padronizador_nomes.html     aplicação em português
file_name_standardizer.html aplicação em inglês
README.md                   esta documentação (PT)
README.en.md                documentação em inglês
```

---

## Compatibilidade

Qualquer navegador moderno com suporte a ES6+ e `localStorage`. Sem servidor, sem build, sem internet após o carregamento inicial das fontes.
