#### 7.6.7.6 Clonagem de dados comprimidos

O clonagem de dados compactados em páginas é suportado. Os seguintes requisitos se aplicam ao clonar dados remotos:

- O sistema de arquivos do destinatário deve suportar arquivos esparsos e perfuração de buracos para que a perfuração de buracos ocorra no destinatário.

- Os sistemas de arquivos do doador e do receptor devem ter o mesmo tamanho de bloco. Se os tamanhos de bloco dos sistemas de arquivos forem diferentes, será exibido um erro semelhante ao seguinte: ERRO 3868 (HY000): Configuração de clonagem Tamanho de bloco do FS: O valor do doador é diferente do valor do receptor: 114688.

Para obter informações sobre o recurso de compressão de páginas, consulte a Seção 17.9.2, “Compressão de Páginas InnoDB”.
