#### 7.6.7.6 Clonagem de Dados Comprimidos

A clonagem de dados compactados por página é suportada.

- O sistema de ficheiros do destinatário deve suportar ficheiros esparsos e perfuramento de buracos para que o perfuramento de buracos ocorra no destinatário.
- Se os tamanhos dos blocos do sistema de arquivos forem diferentes, será reportado um erro semelhante ao seguinte: ERRO 3868 (HY000): Configuração de clone FS Tamanho do bloco: Valor do doador: 114688 é diferente do valor do destinatário: 4096.

Para obter informações sobre a funcionalidade de compressão de páginas, ver Secção 17.9.2, "InnoDB Page Compression".
