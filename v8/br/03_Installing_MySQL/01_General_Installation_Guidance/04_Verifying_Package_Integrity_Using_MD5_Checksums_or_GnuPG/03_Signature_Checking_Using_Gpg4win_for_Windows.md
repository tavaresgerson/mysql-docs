#### 2.1.4.3 Verificação de assinatura usando o Gpg4win para Windows

A seção 2.1.4.2, “Verificação de assinaturas usando GnuPG”, descreve como verificar os downloads do MySQL usando GPG. Esse guia também se aplica ao Microsoft Windows, mas outra opção é usar uma ferramenta de interface gráfica como o Gpg4win. Você pode usar uma ferramenta diferente, mas nossos exemplos são baseados no Gpg4win e utilizam sua interface gráfica `Kleopatra` incluída.

Baixe e instale o Gpg4win, e depois carregue o Kleopatra. O diálogo deve parecer semelhante a:

**Figura 2.1 Kleopatra: Tela Inicial**

![Shows the default Kleopatra screen. The top menu includes "File", "View", "Certificates", "Tools", "Settings", "Window", and "Help.". Underneath the top menu is a horizontal action bar with available buttons to "Import Certificates", "Redisplay", and "Lookup Certificates on Server". Greyed out buttons are "Export Certificates" and "Stop Operation". Underneath is a search box titled "Find". Underneath that are three tabs: "My Certificates", "Trusted Certificates", and "Other Certificates" with the "My Certificates" tab selected. "My Certificates" contains six columns: "Name", "E-Mail", "Valid From", "Valid Until", "Details", and "Key-ID". There are no example values.](images/gnupg-kleopatra-home.png)

Em seguida, adicione o certificado de Engenharia de Lançamento do MySQL. Faça isso clicando em Arquivo, Procure Certificados no Servidor. Digite "Engenharia de Lançamento do MySQL" na caixa de pesquisa e pressione Pesquisar.

**Figura 2.2 Kleopatra: Assistente para Pesquisa de Certificados no Servidor: Encontrando um Certificado**

![Shows a search input field titled "Find" with "mysql release engineering" entered. The one result contains the following values: Name=MySQL Release Engineering, E-Mail=mysql-build@oss.oracle.com, Valid From=2003-02-03, Valid Until="", Details=OpenPGP, Fingerprint=5072E1F5, and Key-ID=5072E1F5. Available action buttons are: Search, Select All, Deselect All, Details, Import, and Close.](images/gnupg-kleopatra-find-certificate.png)

Selecione o certificado "Engenharia de Lançamento do MySQL". O Fingerprint e Key-ID devem ser "3A79BD29" para o MySQL 8.0.28 e versões posteriores ou "5072E1F5" para o MySQL 8.0.27 e versões anteriores, ou escolha Detalhes... para confirmar se o certificado é válido. Agora, importe-o clicando em Importar. Quando o diálogo de importação for exibido, escolha Ok, e este certificado deve agora estar listado na guia Certificados Importado.

Em seguida, configure o nível de confiança para o nosso certificado. Selecione o nosso certificado e, no menu principal, selecione Certificados, Alterar confiança do proprietário.... Sugerimos que você escolha "Verificações de confiança muito precisas" para o nosso certificado, pois, caso contrário, você pode não conseguir verificar nossa assinatura. Selecione "Verificações de confiança muito precisas" para habilitar a "confiança total" e, em seguida, pressione OK.

**Figura 2.3 Kleopatra: Alterar o nível de confiança para a engenharia de lançamento do MySQL**

![A list of trust options are displayed, the options include "I don't know (unknown trust)", "I do NOT trust them (never trust)", "I believe checks are casual (marginal trust)", "I believe checks are very accurate (full trust)", and "This is my certificate (ultimate trust)". The "I believe checks are very accurate (full trust)" option is selected.](images/gnupg-kleopatra-change-trust.png)

Em seguida, verifique o arquivo do pacote MySQL baixado. Isso requer arquivos tanto para o arquivo empacotado quanto para a assinatura. O arquivo de assinatura deve ter o mesmo nome que o arquivo empacotado, mas com a extensão `.asc` anexada, conforme mostrado no exemplo na tabela a seguir. A assinatura está vinculada na página de downloads para cada produto MySQL. Você deve criar o arquivo `.asc` com essa assinatura.

**Tabela 2.2 Arquivos de pacote e assinatura do MySQL para o instalador do MySQL para o Microsoft Windows**

<table><thead><tr> <th>Tipo de arquivo</th> <th>Nome do arquivo</th> </tr></thead><tbody><tr> <td>Arquivo de distribuição</td> <td>[[<code>mysql-installer-community-8.0.44.msi</code>]]</td> </tr><tr> <td>Arquivo de assinatura</td> <td>[[<code>mysql-installer-community-8.0.44.msi.asc</code>]]</td> </tr></tbody></table>

Certifique-se de que ambos os arquivos estejam armazenados no mesmo diretório e, em seguida, execute o seguinte comando para verificar a assinatura do arquivo de distribuição. Arraste e solte o arquivo de assinatura (`.asc`) para o Kleopatra ou carregue o diálogo a partir de Arquivo, Desencriptar/Verificar Arquivos..., e, em seguida, escolha o arquivo `.msi` ou `.asc`.

**Figura 2.4 Kleopatra: Diálogo para Decriptor e Verificação de Arquivos**

![Shows available decrypt and verify options to perform. A MySQL Installer MSI file is used in the example where the .asc file is listed as "Input file" and the .msi file is listed under "Signed Data". The "Input file is detached signature" option's check box is checked. A "Input file is an archive; unpack with:" option is shown but greyed out. Below is the "Create all output files in a single folder" option check box that is checked, and an "Output folder" input field with "C:/docs" entered as an example. The available buttons are "Back" (greyed out), "Decrypt/Verify", and "Cancel."](images/gnupg-kleopatra-decrypt-load.png)

Clique em Desencriptar/Verificar para verificar o arquivo. Os dois resultados mais comuns são os mostrados na figura a seguir; embora o aviso amarelo possa parecer problemático, o seguinte significa que a verificação do arquivo foi concluída com sucesso. Agora você pode executar este instalador.

**Figura 2.5 Kleopatra: o diálogo para descriptografar e verificar os resultados: todas as operações concluídas**

![Yellow portion of the results window shows "Not enough information to check signature validity" and "The validity of the signature cannot be verified." Also shown is key information, such as the KeyID and email address, the key's sign on date, and also displays the name of the ASC file..](images/gnupg-kleopatra-decrypt-okay-sig.png)

Ver um erro de assinatura vermelha significa que o arquivo está inválido. Não execute o arquivo MSI se você ver esse erro.

**Figura 2.6 Kleopatra: o diálogo para descriptografar e verificar os resultados: ruim**

![Red portion of the results window shows "Invalid signature", "Signed with unknown certificate", "The signature is bad", and also displays the name of the ASC file.](images/gnupg-kleopatra-decrypt-invalid-sig.png)

A seção 2.1.4.2, “Verificação de assinatura usando GnuPG”, explica por que você não vê um resultado verde `Good signature`.
