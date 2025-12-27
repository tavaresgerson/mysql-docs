### 12.10.7 Conjunto de Caracteres Asiático

12.10.7.1 O Conjunto de Caracteres cp932

12.10.7.2 O Conjunto de Caracteres gb18030

Os conjuntos de caracteres asiáticos que suportamos incluem chinês, japonês, coreano e tailandês. Esses conjuntos podem ser complicados. Por exemplo, os conjuntos de caracteres chineses devem permitir milhares de caracteres diferentes. Consulte a Seção 12.10.7.1, “O Conjunto de Caracteres cp932”, para obter informações adicionais sobre os conjuntos de caracteres `cp932` e `sjis`. Consulte a Seção 12.10.7.2, “O Conjunto de Caracteres gb18030”, para obter informações adicionais sobre o suporte a conjuntos de caracteres para o Padrão Nacional Chinês GB 18030.

Para respostas a algumas perguntas e problemas comuns relacionados ao suporte a conjuntos de caracteres asiáticos no MySQL, consulte a Seção A.11, “Perguntas Frequentes do MySQL 9.5: Conjuntos de Caracteres Chinês, Japonês e Coreano do MySQL”.

* Colocções `big5` (Big5 Chinês Tradicional):

  + `big5_bin`
  + `big5_chinese_ci` (padrão)
* Colocções `cp932` (SJIS para Japonês do Windows):

  + `cp932_bin`
  + `cp932_japanese_ci` (padrão)
* Colocções `eucjpms` (UJIS para Japonês do Windows):

  + `eucjpms_bin`
  + `eucjpms_japanese_ci` (padrão)
* Colocções `euckr` (EUC-KR Coreano):

  + `euckr_bin`
  + `euckr_korean_ci` (padrão)
* Colocções `gb2312` (Simplificado Chinês GB2312):

  + `gb2312_bin`
  + `gb2312_chinese_ci` (padrão)
* Colocções `gbk` (GBK Simplificado Chinês):

  + `gbk_bin`
  + `gbk_chinese_ci` (padrão)
* Colocções `gb18030` (Padrão Nacional Chinês GB18030):

  + `gb18030_bin`
  + `gb18030_chinese_ci` (padrão)
  + `gb18030_unicode_520_ci`
* Colocções `sjis` (Shift-JIS Japonês):

  + `sjis_bin`
  + `sjis_japanese_ci` (padrão)
* Colocções `tis620` (Tailandês TIS620):

  + `tis620_bin`
  + `tis620_thai_ci` (padrão)
* Colocções `ujis` (EUC-JP Japonês):

  + `ujis_bin`
  + `ujis_japanese_ci` (padrão)

A combinação de caracteres `big5_chinese_ci` ordena por número de traços.