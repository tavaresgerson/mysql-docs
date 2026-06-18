### 12.10.7 Conjuntos de caracteres asiáticos

12.10.7.1 Conjunto de Caracteres cp932

12.10.7.2 O Conjunto de Caracteres gb18030

Os conjuntos de caracteres asiáticos que suportamos incluem chinês, japonês, coreano e tailandês. Esses conjuntos podem ser complicados. Por exemplo, os conjuntos chineses devem permitir milhares de caracteres diferentes. Consulte a Seção 12.10.7.1, “O Conjunto de Caracteres cp932”, para obter informações adicionais sobre os conjuntos de caracteres `cp932` e `sjis`. Consulte a Seção 12.10.7.2, “O Conjunto de Caracteres gb18030”, para obter informações adicionais sobre o suporte ao conjunto de caracteres do Padrão Nacional Chinês GB 18030.

Para obter respostas para algumas perguntas e problemas comuns relacionados ao suporte para conjuntos de caracteres asiáticos no MySQL, consulte a Seção A.11, “Perguntas frequentes do MySQL 8.0: conjuntos de caracteres chineses, japoneses e coreanos do MySQL”.

- `big5` (colaborações do chinês tradicional Big5):

  - `big5_bin`
  - `big5_chinese_ci` (padrão)
- `cp932` (SJIS para japonês do Windows): colagens:

  - `cp932_bin`
  - `cp932_japanese_ci` (padrão)
- `eucjpms` (UJIS para japonês do Windows) colateias:

  - `eucjpms_bin`
  - `eucjpms_japanese_ci` (padrão)
- `euckr` (EUC-KR coreano) colatações:

  - `euckr_bin`
  - `euckr_korean_ci` (padrão)
- `gb2312` (GB2312 simplificado chinês) coligações:

  - `gb2312_bin`
  - `gb2312_chinese_ci` (padrão)
- `gbk` (GBK simplificado chinês) coligações:

  - `gbk_bin`
  - `gbk_chinese_ci` (padrão)
- `gb18030` (padrão nacional chinês GB18030):

  - `gb18030_bin`
  - `gb18030_chinese_ci` (padrão)
  - `gb18030_unicode_520_ci`
- `sjis` (colagens do japonês Shift-JIS):

  - `sjis_bin`
  - `sjis_japanese_ci` (padrão)
- `tis620` (colações em tailandês TIS620):

  - `tis620_bin`
  - `tis620_thai_ci` (padrão)
- `ujis` (EUC-JP Japonês) colatações:

  - `ujis_bin`
  - `ujis_japanese_ci` (padrão)

A ordenação `big5_chinese_ci` ordena por número de traços.
