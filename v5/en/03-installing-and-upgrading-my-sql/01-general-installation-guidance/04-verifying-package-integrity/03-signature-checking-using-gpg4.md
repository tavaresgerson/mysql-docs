#### 2.1.4.3 Verificação de Assinatura Usando Gpg4win para Windows

A Seção 2.1.4.2, “Verificação de Assinatura Usando GnuPG”, descreve como verificar downloads do MySQL usando GPG. Esse guia também se aplica ao Microsoft Windows, mas outra opção é usar uma ferramenta GUI como o Gpg4win. Você pode usar uma ferramenta diferente, mas nossos exemplos são baseados no Gpg4win e utilizam a GUI `Kleopatra` incluída nele.

Baixe e instale o Gpg4win e, em seguida, carregue o Kleopatra. O diálogo deve ser semelhante a:

**Figure 2.1 Kleopatra: Tela Inicial**

![Shows the default Kleopatra screen. The top menu includes "File", "View", "Certificates", "Tools", "Settings", "Window", and "Help.". Underneath the top menu is a horizontal action bar with available buttons to "Import Certificates", "Redisplay", and "Lookup Certificates on Server". Greyed out buttons are "Export Certificates" and "Stop Operation". Underneath is a search box titled "Find". Underneath that are three tabs: "My Certificates", "Trusted Certificates", and "Other Certificates" with the "My Certificates" tab selected. "My Certificates" contains six columns: "Name", "E-Mail", "Valid From", "Valid Until", "Details", and "Key-ID". There are no example values.](images/gnupg-kleopatra-home.png)

Em seguida, adicione o certificado de Engenharia de Lançamento (Release Engineering) do MySQL. Faça isso clicando em File, Lookup Certificates on Server. Digite "Mysql Release Engineering" na caixa de busca e pressione Search.

**Figure 2.2 Kleopatra: Assistente de Lookup Certificates on Server: Encontrando um Certificado**

![Shows a search input field titled "Find" with "mysql release engineering" entered. The one result contains the following values: Name=MySQL Release Engineering, E-Mail=mysql-build@oss.oracle.com, Valid From=2003-02-03, Valid Until="", Details=OpenPGP, Fingerprint=5072E1F5, and Key-ID=5072E1F5. Available action buttons are: Search, Select All, Deselect All, Details, Import, and Close.](images/gnupg-kleopatra-find-certificate.png)

Selecione o certificado "MySQL Release Engineering". O Fingerprint e o Key-ID devem ser "3A79BD29" para MySQL 5.7.37 e superior, ou "5072E1F5" para MySQL 5.7.36 e anterior, ou escolha Details... para confirmar se o certificado é válido. Agora, importe-o clicando em Import. Um diálogo de importação é exibido; escolha Okay, e este certificado deverá ser listado na aba Imported Certificates.

Em seguida, configure o nível de confiança (trust level) para nosso certificado. Selecione nosso certificado, depois no menu principal selecione Certificates, Change Owner Trust.... Sugerimos escolher I believe checks are very accurate para nosso certificado, pois, caso contrário, você pode não conseguir verificar nossa assinatura. Selecione I believe checks are very accurate para habilitar a "confiança total" (full trust) e pressione OK.

**Figure 2.3 Kleopatra: Alterar Nível de Confiança para MySQL Release Engineering**

![A list of trust options are displayed, the options include "I don't know (unknown trust)", "I do NOT trust them (never trust)", "I believe checks are casual (marginal trust)", "I believe checks are very accurate (full trust)", and "This is my certificate (ultimate trust)". The "I believe checks are very accurate (full trust)" option is selected.](images/gnupg-kleopatra-change-trust.png)

Em seguida, verifique o arquivo do pacote MySQL baixado. Isso requer arquivos tanto para o arquivo empacotado quanto para a assinatura. O arquivo de assinatura deve ter o mesmo nome do arquivo empacotado, mas com a extensão `.asc` anexada, conforme mostrado no exemplo da tabela a seguir. A assinatura está vinculada à página de downloads de cada produto MySQL. Você deve criar o arquivo `.asc` com esta assinatura.

**Table 2.2 Arquivos de Pacote e de Assinatura do MySQL Installer para Microsoft Windows**

<table><thead><tr> <th>Tipo de Arquivo</th> <th>Nome do Arquivo</th> </tr></thead><tbody><tr> <td>Arquivo de distribuição</td> <td><code>mysql-installer-community-5.7.44.msi</code></td> </tr><tr> <td>Arquivo de assinatura</td> <td><code>mysql-installer-community-5.7.44.msi.asc</code></td> </tr></tbody></table>

Certifique-se de que ambos os arquivos estejam armazenados no mesmo diretório e, em seguida, execute o seguinte comando para verificar a assinatura do arquivo de distribuição. Arraste e solte o arquivo de assinatura (`.asc`) no Kleopatra, ou carregue o diálogo em File, Decrypt/Verify Files..., e então escolha o arquivo `.msi` ou o `.asc`.

**Figure 2.4 Kleopatra: O Diálogo Decrypt and Verify Files**

![Shows available decrypt and verify options to perform. A MySQL Installer MSI file is used in the example where the .asc file is listed as "Input file" and the .msi file is listed under "Signed Data". The "Input file is detached signature" option's check box is checked. A "Input file is an archive; unpack with:" option is shown but greyed out. Below is the "Create all output files in a single folder" option check box that is checked, and an "Output folder" input field with "C:/docs" entered as an example. The available buttons are "Back" (greyed out), "Decrypt/Verify", and "Cancel."](images/gnupg-kleopatra-decrypt-load.png)

Clique em Decrypt/Verify para verificar o arquivo. Os dois resultados mais comuns são semelhantes ao seguinte e, embora o aviso amarelo pareça problemático, isso significa que a verificação do arquivo foi bem-sucedida. Você pode agora executar este instalador.

**Figure 2.5 Kleopatra: O Diálogo de Resultados Decrypt and Verify: Todas as operações concluídas**

![Yellow portion of the results window shows "Not enough information to check signature validity" and "The validity of the signature cannot be verified." Also shown is key information, such as the KeyID and email address, the key's sign on date, and also displays the name of the ASC file..](images/gnupg-kleopatra-decrypt-okay-sig.png)

Ver um erro vermelho "The signature is bad" significa que o arquivo é inválido. Não execute o arquivo MSI se você vir este erro.

**Figure 2.6 Kleopatra: O Diálogo de Resultados Decrypt and Verify: Inválido**

![Red portion of the results window shows "Invalid signature", "Signed with unknown certificate", "The signature is bad", and also displays the name of the ASC file.](images/gnupg-kleopatra-decrypt-invalid-sig.png)

A Seção 2.1.4.2, “Verificação de Assinatura Usando GnuPG”, explica por que você provavelmente não vê um resultado verde de `Good signature`.
