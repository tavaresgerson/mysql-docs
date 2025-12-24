#### 2.1.4.3 Verificação de assinatura usando Gpg4win para Windows

A seção 2.1.4.2, "Checagem de assinatura usando GnuPG", descreve como verificar downloads do MySQL usando GPG. Esse guia também se aplica ao Microsoft Windows, mas outra opção é usar uma ferramenta GUI como Gpg4win. Você pode usar uma ferramenta diferente, mas nossos exemplos são baseados em Gpg4win e utilizam sua GUI `Kleopatra`.

Baixe e instale Gpg4win, carregue Cleopatra e adicione o certificado de Engenharia de Release do MySQL. Faça isso clicando em Arquivo, Pesquisa no Servidor. Digite "Engenharia de Release do MySQL" na caixa de pesquisa e pressione Pesquisa.

\*\* Figura 2.1 Cleópatra: Revisão do Servidor Assistente: Encontrar um Certificado\*\*

![Shows a search input field titled "Find" with "MySQL Release Engineering" entered. The one result contains the following values: Name=MySQL Release Engineering, E-Mail=mysql-build@oss.oracle.com, Valid From=2021-12-14, Valid Until="Unknown", and Key-ID=467B 942D 3A79 BD29. Available action buttons are: Search, Select All, Deselect All, Details, Import, and Close.](images/gnupg-kleopatra-find-certificate.png)

Selecione o certificado "MySQL Release Engineering". O Key-ID deve referenciar "`3A79 BD29`", ou escolha Detalhes... para confirmar que o certificado é válido. Agora, importe-o clicando em Importação. Quando o diálogo de importação for exibido, escolha Ok, e este certificado deve agora ser listado na guia Certificados Importados.

Em seguida, conceda confiança ao certificado. Selecione o nosso certificado, em seguida, no menu principal, selecione Certificados, Altere o Poder de Certificação e clique em Conceder o Poder.

\*\* Figura 2.2 Cleopatra: Concessão de Potência de Certificação para Engenharia de Lançamento do MySQL \*\*

![A "Grant Certification Power" dialogue is displayed. Available action buttons are: Grant Power and Cancel.](images/gnupg-kleopatra-grant-certification-power.png)

Em seguida, verifique o arquivo do pacote MySQL baixado. Isso requer arquivos tanto para o arquivo empacotado quanto para a assinatura. O arquivo de assinatura deve ter o mesmo nome que o arquivo empacotado, mas com uma extensão `.asc` anexada, como mostrado no exemplo na tabela a seguir. A assinatura está vinculada na página de downloads para cada produto MySQL. Você deve criar o arquivo `.asc` com essa assinatura.

**Tabela 2.2 Arquivos de Pacote e Assinatura do MySQL para o MSI do Servidor MySQL para o Microsoft Windows**

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Tipo de ficheiro</th> <th>Nome do ficheiro</th> </tr></thead><tbody><tr> <td>Arquivo de distribuição</td> <td>[[<code>mysql-8.4.6-winx64.msi</code>]]</td> </tr><tr> <td>Ficheiro de assinatura</td> <td>[[<code>mysql-8.4.6-winx64.msi.asc</code>]]</td> </tr></tbody></table>

Certifique-se de que ambos os arquivos estão armazenados no mesmo diretório e, em seguida, execute o seguinte comando para verificar a assinatura para o arquivo de distribuição. Carregue o diálogo de Arquivo, Decodificar/Verificar Arquivos..., e, em seguida, escolha o arquivo `.asc`.

Os dois resultados mais comuns se parecem com as figuras a seguir; e embora o aviso "Os dados não puderam ser verificados". pareça problemático, a verificação do arquivo foi aprovada com sucesso. Para obter informações adicionais sobre o que significa este aviso, clique em Mostrar Log de Auditoria e compare-o com a Seção 2.1.4.2,  Verificação de Assinatura Usando GnuPG. Agora você pode executar o arquivo MSI.

\*\* Figura 2.3 Cleópatra: o Diálogo Descodificar e Verificar Resultados: Sucesso\*\*

![It shows "The data could not be verified", and also shown is key information, such as the KeyID and email address, the key's sign on date, and also displays the name of the ASC file..](images/gnupg-kleopatra-decrypt-okay-sig.png)

Ver um erro como Verificação falhou: Nenhum Dados. significa que o arquivo é inválido. Não execute o arquivo MSI se você vir este erro.

\*\* Figura 2.4 Cleópatra: os resultados de descriptografia e verificação Diálogo: mau\*\*

![It shows "Verification failed: No data." and also displays the name of the ASC file.](images/gnupg-kleopatra-decrypt-invalid-sig.png)
