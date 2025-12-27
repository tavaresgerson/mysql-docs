### 12.10.2 Conjuntos de Caracteres da Europa Ocidental

Os conjuntos de caracteres da Europa Ocidental abrangem a maioria das línguas da Europa Ocidental, como francês, espanhol, catalão, basco, português, italiano, albanês, holandês, alemão, dinamarquês, sueco, norueguês, finlandês, feroês, islandês, irlandês, escocês e inglês.

* Colocacionais `ascii` (ASCII dos EUA):

  + `ascii_bin`
  + `ascii_general_ci` (padrão)
* Colocacionais `cp850` (dos West European):

  + `cp850_bin`
  + `cp850_general_ci` (padrão)
* Colocacionais `dec8` (DEC West European):

  + `dec8_bin`
  + `dec8_swedish_ci` (padrão)

O conjunto de caracteres `dec` está desatualizado; espere que o suporte a ele seja removido em uma versão subsequente do MySQL.

* Colocacionais `hp8` (HP West European):

  + `hp8_bin`
  + `hp8_english_ci` (padrão)

O conjunto de caracteres `hp8` está desatualizado; espere que o suporte a ele seja removido em uma versão subsequente do MySQL.

* Colocacionais `latin1` (cp1252 West European):

  + `latin1_bin`
  + `latin1_danish_ci`
  + `latin1_general_ci`
  + `latin1_general_cs`
  + `latin1_german1_ci`
  + `latin1_german2_ci`
  + `latin1_spanish_ci`
  + `latin1_swedish_ci` (padrão)

O `latin1` do MySQL é o mesmo que o conjunto de caracteres `cp1252` do Windows. Isso significa que é o mesmo que o `ISO 8859-1` oficial ou a autoridade de atribuição de números da Internet (IANA) `latin1`, exceto que a `latin1` da IANA trata os pontos de código entre `0x80` e `0x9f` como “definidos”, enquanto o `cp1252`, e, portanto, o `latin1` do MySQL, atribuem caracteres para essas posições. Por exemplo, `0x80` é o símbolo do Euro. Para as entradas “definidas” no `cp1252`, o MySQL traduz `0x81` para o Unicode `0x0081`, `0x8d` para `0x008d`, `0x8f` para `0x008f`, `0x90` para `0x0090` e `0x9d` para `0x009d`.

A combinação de caracteres `latin1_swedish_ci` é a padrão que provavelmente é usada pela maioria dos clientes do MySQL. Embora seja frequentemente dito que ela é baseada nas regras de combinação de caracteres sueco/finlandês, há suecas e finlandeses que discordam dessa afirmação.

As combinações de caracteres `latin1_german1_ci` e `latin1_german2_ci` são baseadas nas normas DIN-1 e DIN-2, onde DIN significa *Deutsches Institut für Normung* (o equivalente alemão da ANSI). DIN-1 é chamado de "combinação de dicionário" e DIN-2 é chamado de "combinação de catálogo telefônico". Para um exemplo do efeito disso em comparações ou ao fazer buscas, veja a Seção 12.8.6, "Exemplos do Efeito da Combinação de Caracteres".

+ Regras de `latin1_german1_ci` (dicionário):

    ```
    Ä = A
    Ö = O
    Ü = U
    ß = s
    ```

+ Regras de `latin1_german2_ci` (catálogo telefônico):

    ```
    Ä = AE
    Ö = OE
    Ü = UE
    ß = ss
    ```

Na combinação de caracteres `latin1_spanish_ci`, `ñ` (tilde n) é uma letra separada entre `n` e `o`.

* Combinações de caracteres `macroman` (Mac Europa Ocidental):

    + `macroman_bin`
    + `macroman_general_ci` (padrão)

`macroroman` está desatualizado; espere que o suporte a ele seja removido em uma versão subsequente do MySQL.

* Combinações de caracteres `swe7` (sueco 7 bits):

    + `swe7_bin`
    + `swe7_swedish_ci` (padrão)