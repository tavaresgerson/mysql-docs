### 10.10.7 Conjuntos de caracteres asiáticos

10.10.7.1 O Conjunto de Caracteres cp932

10.10.7.2 O Conjunto de Caracteres gb18030

Os conjuntos de caracteres asiáticos que suportamos incluem chinês, japonês, coreano e tailandês. Esses conjuntos podem ser complicados. Por exemplo, os conjuntos chineses devem permitir milhares de caracteres diferentes. Consulte a Seção 10.10.7.1, “O Conjunto de Caracteres cp932”, para obter informações adicionais sobre os conjuntos de caracteres `cp932` e `sjis`. Consulte a Seção 10.10.7.2, “O Conjunto de Caracteres gb18030”, para obter informações adicionais sobre o suporte a conjuntos de caracteres do Padrão Nacional Chinês GB 18030.

Para obter respostas para algumas perguntas e problemas comuns relacionados ao suporte para conjuntos de caracteres asiáticos no MySQL, consulte a Seção A.11, “Perguntas frequentes do MySQL 5.7: conjuntos de caracteres chineses, japoneses e coreanos do MySQL”.

- Colagens `big5` (Big5 Traditional Chinese):

  - `big5_bin`
  - `big5_chinese_ci` (padrão)
- Colagens `cp932` (SJIS para japonês do Windows):

  - `cp932_bin`
  - `cp932_japanese_ci` (padrão)
- `eucjpms` (UJIS para japonês do Windows):

  - `eucjpms_bin`
  - `eucjpms_japanese_ci` (padrão)
- Colagens `euckr` (EUC-KR coreano):

  - `euckr_bin`
  - `euckr_korean_ci` (padrão)
- Colagens `gb2312` (GB2312 simplificado chinês):

  - `gb2312_bin`
  - `gb2312_chinese_ci` (padrão)
- Colagens `gbk` (GBK simplificado chinês):

  - `gbk_bin`
  - `gbk_chinese_ci` (padrão)
- Coligações `gb18030` (Padrão Nacional da China GB18030):

  - `gb18030_bin`
  - `gb18030_chinese_ci` (padrão)
  - `gb18030_unicode_520_ci`
- Colagens `sjis` (Shift-JIS japonês):

  - `sjis_bin`
  - `sjis_japanese_ci` (padrão)
- `tis620` (TIS620 tailandês) collation:

  - `tis620_bin`
  - `tis620_thai_ci` (padrão)
- `ujis` (colações japonesas EUC-JP):

  - `ujis_bin`
  - `ujis_japanese_ci` (padrão)

A combinação de caracteres `big5_chinese_ci` ordena por número de traços.
