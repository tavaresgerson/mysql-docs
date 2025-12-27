#### 7.6.7.6 Clonagem de Dados Compactos

A clonagem de dados compactados por página é suportada. Os seguintes requisitos se aplicam ao clonar dados remotos:

* O sistema de arquivos do destinatário deve suportar arquivos esparsos e perfuração de buracos para que a perfuração de buracos ocorra no destinatário.
* Os sistemas de arquivos do doador e do destinatário devem ter o mesmo tamanho de bloco. Se os tamanhos de bloco dos sistemas de arquivos forem diferentes, será exibido um erro semelhante ao seguinte: ERRO 3868 (HY000): Configuração de Clonagem Tamanho de Bloco FS: Valor do doador: 114688 é diferente do valor do destinatário: 4096.

Para obter informações sobre o recurso de compactação de página, consulte a Seção 17.9.2, “Compactação de Página InnoDB”.