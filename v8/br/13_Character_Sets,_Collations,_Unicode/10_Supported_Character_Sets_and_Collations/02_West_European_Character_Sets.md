### 12.10.1 Conjuntos de Caracteres do Ocidente Europeu

Os conjuntos de caracteres da Europa Ocidental cobrem a maioria das línguas da Europa Ocidental, como francês, espanhol, catalão, basco, português, italiano, albanês, holandês, alemão, dinamarquês, sueco, norueguês, finlandês, feroês, islandês, irlandês, escocês e inglês.

- `ascii` (US ASCII) colatações:

  - `ascii_bin`
  - `ascii_general_ci` (padrão)

- `cp850` (colagens do oeste da Europa do Sul):

  - `cp850_bin`
  - `cp850_general_ci` (padrão)

- `dec8` (colagens do Ocidente Europeu da DEC):

  - `dec8_bin`
  - `dec8_swedish_ci` (padrão)

  O conjunto de caracteres `dec` está desatualizado no MySQL 8.0.28; espere que o suporte a ele seja removido em uma versão subsequente do MySQL.

- `hp8` (HP Europa Ocidental) colatações:

  - `hp8_bin`
  - `hp8_english_ci` (padrão)

  O conjunto de caracteres `hp8` está desatualizado no MySQL 8.0.28; espere que o suporte a ele seja removido em uma versão subsequente do MySQL.

- `latin1` (colagens cp1252 da Europa Ocidental):

  - `latin1_bin`
  - `latin1_danish_ci`
  - `latin1_general_ci`
  - `latin1_general_cs`
  - `latin1_german1_ci`
  - `latin1_german2_ci`
  - `latin1_spanish_ci`
  - `latin1_swedish_ci` (padrão)

  O conjunto de caracteres `latin1` do MySQL é o mesmo do conjunto de caracteres `cp1252` do Windows. Isso significa que é o mesmo que o conjunto de caracteres oficial `ISO 8859-1` ou a autoridade de atribuição de números da Internet (IANA) `latin1`, exceto que a IANA `latin1` trata os pontos de código entre `0x80` e `0x9f` como “definidos”, enquanto o MySQL `latin1` atribui caracteres para essas posições. Por exemplo, `0x80` é o símbolo do euro. Para as entradas “definidas” em `cp1252`, o MySQL traduz `0x81` para o Unicode `0x0081`, `0x8d` para `0x008d`, `0x8f` para `0x008f`, `0x90` para `0x0090` e `0x9d` para `0x009d`.

  A collation `latin1_swedish_ci` é a padrão que provavelmente é usada pela maioria dos clientes do MySQL. Embora seja frequentemente dito que ela é baseada nas regras de collation sueco/finlandês, há suecas e finlandeses que discordam dessa afirmação.

  As collation `latin1_german1_ci` e `latin1_german2_ci` são baseadas nas normas DIN-1 e DIN-2, onde DIN significa *Deutsches Institut für Normung* (o equivalente alemão do ANSI). A DIN-1 é chamada de "collation de dicionário" e a DIN-2 é chamada de "collation de catálogo telefônico". Para um exemplo do efeito que isso tem em comparações ou durante pesquisas, consulte a Seção 12.8.6, "Exemplos do Efeito da Collation".

  - Regras do `latin1_german1_ci` (dicionário):

    ```
    Ä = A
    Ö = O
    Ü = U
    ß = s
    ```

  - Regras do `latin1_german2_ci` (livro telefônico):

    ```
    Ä = AE
    Ö = OE
    Ü = UE
    ß = ss
    ```

  Na concordância `latin1_spanish_ci`, `ñ` (tilde) é uma letra separada entre `n` e `o`.

- `macroman` (colagens do oeste da Europa)

  - `macroman_bin`
  - `macroman_general_ci` (padrão)

  `macroroman` é descontinuado no MySQL 8.0.28; espere que o suporte a ele seja removido em uma versão subsequente do MySQL.

- `swe7` (colações suecas de 7 bits):

  - `swe7_bin`
  - `swe7_swedish_ci` (padrão)
