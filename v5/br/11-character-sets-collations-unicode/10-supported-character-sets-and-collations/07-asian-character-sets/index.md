### 10.10.7 Conjuntos de Caracteres Asiáticos

10.10.7.1 O Conjunto de Caracteres cp932

10.10.7.2 O Conjunto de Caracteres gb18030

Os conjuntos de caracteres asiáticos que suportamos incluem Chinês, Japonês, Coreano e Tailandês. Estes podem ser complexos. Por exemplo, os conjuntos chineses devem suportar milhares de caracteres diferentes. Consulte a Seção 10.10.7.1, “O Conjunto de Caracteres cp932”, para obter informações adicionais sobre os conjuntos de caracteres `cp932` e `sjis`. Consulte a Seção 10.10.7.2, “O Conjunto de Caracteres gb18030”, para obter informações adicionais sobre o suporte a conjuntos de caracteres para o Padrão Nacional Chinês GB 18030.

Para respostas a algumas perguntas e problemas comuns relacionados ao suporte de conjuntos de caracteres asiáticos no MySQL, consulte a Seção A.11, “FAQ do MySQL 5.7: Conjuntos de Caracteres Chinês, Japonês e Coreano do MySQL”.

* `big5` (Chinês Tradicional Big5) collations:

  + `big5_bin`
  + `big5_chinese_ci` (padrão)
* `cp932` (SJIS para Windows Japonês) collations:

  + `cp932_bin`
  + `cp932_japanese_ci` (padrão)
* `eucjpms` (UJIS para Windows Japonês) collations:

  + `eucjpms_bin`
  + `eucjpms_japanese_ci` (padrão)
* `euckr` (Coreano EUC-KR) collations:

  + `euckr_bin`
  + `euckr_korean_ci` (padrão)
* `gb2312` (Chinês Simplificado GB2312) collations:

  + `gb2312_bin`
  + `gb2312_chinese_ci` (padrão)
* `gbk` (Chinês Simplificado GBK) collations:

  + `gbk_bin`
  + `gbk_chinese_ci` (padrão)
* `gb18030` (Padrão Nacional Chinês GB18030) collations:

  + `gb18030_bin`
  + `gb18030_chinese_ci` (padrão)
  + `gb18030_unicode_520_ci`
* `sjis` (Japonês Shift-JIS) collations:

  + `sjis_bin`
  + `sjis_japanese_ci` (padrão)
* `tis620` (Tailandês TIS620) collations:

  + `tis620_bin`
  + `tis620_thai_ci` (padrão)
* `ujis` (Japonês EUC-JP) collations:

  + `ujis_bin`
  + `ujis_japanese_ci` (padrão)

A collation `big5_chinese_ci` realiza a ordenação com base no número de traços.