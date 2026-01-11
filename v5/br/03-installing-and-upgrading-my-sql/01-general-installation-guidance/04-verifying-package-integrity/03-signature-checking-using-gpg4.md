#### 2.1.4.3 Verificação de assinatura usando o Gpg4win para Windows

A seção 2.1.4.2, “Verificação de assinaturas usando GnuPG”, descreve como verificar os downloads do MySQL usando GPG. Esse guia também se aplica ao Microsoft Windows, mas outra opção é usar uma ferramenta de interface gráfica como o Gpg4win. Você pode usar uma ferramenta diferente, mas nossos exemplos são baseados no Gpg4win e utilizam sua interface gráfica integrada, a `Kleopatra`.

Baixe e instale o Gpg4win, e depois carregue o Kleopatra. O diálogo deve parecer semelhante a:

**Figura 2.1 Kleopatra: Tela Inicial**

![Mostra a tela padrão do Kleopatra. O menu superior inclui "Arquivo", "Exibir", "Certificados", "Ferramentas", "Configurações", "Janela" e "Ajuda". Abaixo do menu superior, há uma barra de ação horizontal com botões disponíveis para "Importar Certificados", "Rediminuir" e "Buscar Certificados no Servidor". Os botões cinza são "Exportar Certificados" e "Parar Operação". Abaixo está uma caixa de pesquisa intitulada "Buscar". Abaixo disso, há três guias: "Meus Certificados", "Certificados Confiáveis" e "Outros Certificados", com o guia "Meus Certificados" selecionado. "Meus Certificados" contém seis colunas: "Nome", "E-mail", "Válido a partir", "Válido até", "Detalhes" e "ID da Chave". Não há valores de exemplo.](images/gnupg-kleopatra-home.png)

Em seguida, adicione o certificado de Engenharia de Lançamento do MySQL. Faça isso clicando em Arquivo, Procure Certificados no Servidor. Digite "Engenharia de Lançamento do MySQL" na caixa de pesquisa e pressione Pesquisar.

**Figura 2.2 Kleopatra: Assistente para Pesquisa de Certificados no Servidor: Encontrando um Certificado**

![Mostra um campo de entrada de pesquisa intitulado "Encontrar" com "mysql release engineering" digitado. O único resultado contém os seguintes valores: Nome=MySQL Release Engineering, E-Mail=mysql-build@oss.oracle.com, Válido a partir=2003-02-03, Válido até="", Detalhes=OpenPGP, Digital de impressão=5072E1F5 e ID da chave=5072E1F5. Os botões de ação disponíveis são: Pesquisar, Selecionar tudo, Desmarcar tudo, Detalhes, Importar e Fechar.](images/gnupg-kleopatra-find-certificate.png)

Selecione o certificado "Engenharia de Lançamento do MySQL". O Fingerprint e Key-ID devem ser "3A79BD29" para o MySQL 5.7.37 e versões posteriores ou "5072E1F5" para o MySQL 5.7.36 e versões anteriores, ou escolha Detalhes... para confirmar se o certificado é válido. Agora, importe-o clicando em Importar. Uma caixa de diálogo de importação é exibida; escolha Ok, e este certificado deve agora estar listado na guia Certificados Importado.

Em seguida, configure o nível de confiança para o nosso certificado. Selecione o nosso certificado e, no menu principal, selecione Certificados, Alterar confiança do proprietário.... Sugerimos que você escolha "Verificações de confiança muito precisas" para o nosso certificado, pois, caso contrário, você pode não conseguir verificar nossa assinatura. Selecione "Verificações de confiança muito precisas" para habilitar a "confiança total" e, em seguida, pressione OK.

**Figura 2.3 Kleopatra: Alterar o nível de confiança para a engenharia de lançamento do MySQL**

![Uma lista de opções de confiança é exibida, as opções incluem "Não sei (confiança desconhecida)", "Eu NÃO confio neles (nunca confio)", "Eu acredito que as verificações são casuais (confiança marginal)", "Eu acredito que as verificações são muito precisas (confiança total)" e "Este é meu certificado (confiança máxima)". A opção "Eu acredito que as verificações são muito precisas (confiança total)" está selecionada.](images/gnupg-kleopatra-change-trust.png)

Em seguida, verifique o arquivo do pacote MySQL baixado. Isso requer arquivos tanto para o arquivo empacotado quanto para a assinatura. O arquivo de assinatura deve ter o mesmo nome que o arquivo empacotado, mas com a extensão `.asc` anexada, conforme mostrado no exemplo na tabela a seguir. A assinatura está vinculada na página de downloads para cada produto MySQL. Você deve criar o arquivo `.asc` com essa assinatura.

**Tabela 2.2 Arquivos de pacote e assinatura do MySQL para o instalador do MySQL para o Microsoft Windows**

<table><thead><tr> <th>Tipo de arquivo</th> <th>Nome do arquivo</th> </tr></thead><tbody><tr> <td>Arquivo de distribuição</td> <td><code>mysql-installer-community-5.7.44.msi</code></td> </tr><tr> <td>Arquivo de assinatura</td> <td><code>mysql-installer-community-5.7.44.msi.asc</code></td> </tr></tbody></table>

Certifique-se de que ambos os arquivos estejam armazenados no mesmo diretório e, em seguida, execute o seguinte comando para verificar a assinatura do arquivo de distribuição. Arraste e solte o arquivo de assinatura (`.asc`) para o Kleopatra ou carregue o diálogo a partir de Arquivo, Desencriptar/Verificar Arquivos..., e, em seguida, escolha o arquivo `.msi` ou `.asc`.

**Figura 2.4 Kleopatra: Diálogo para Decriptor e Verificação de Arquivos**

![Exibe opções disponíveis para descriptografar e verificar. Um arquivo MSI do Instalador MySQL é usado no exemplo, onde o arquivo .asc está listado como "Arquivo de entrada" e o arquivo .msi está listado em "Dados assinados". A caixa de seleção "Arquivo de entrada é uma assinatura desvinculada" está marcada. A opção "Arquivo de entrada é um arquivo; desempacotar com:" é mostrada, mas desativada. Abaixo está a caixa de seleção da opção "Criar todos os arquivos de saída em uma única pasta", que está marcada, e um campo de entrada "Pasta de saída" com "C:/docs" inserido como exemplo. Os botões disponíveis são "Voltar" (desativado), "Descriptografar/Verificar" e "Cancelar."](images/gnupg-kleopatra-decrypt-load.png)

Clique em Desencriptar/Verificar para verificar o arquivo. Os dois resultados mais comuns são os seguintes, e embora o aviso amarelo pareça problemático, o seguinte significa que a verificação do arquivo foi concluída com sucesso. Agora você pode executar este instalador.

**Figura 2.5 Kleopatra: o diálogo para descriptografar e verificar os resultados: todas as operações concluídas**

![A parte amarela da janela de resultados mostra "Não há informações suficientes para verificar a validade da assinatura" e "A validade da assinatura não pode ser verificada". Também são exibidas informações importantes, como o KeyID e o endereço de e-mail, a data de assinatura da chave e também exibe o nome do arquivo ASC.](images/gnupg-kleopatra-decrypt-okay-sig.png)

Ver um erro vermelho "A assinatura está incorreta" significa que o arquivo é inválido. Não execute o arquivo MSI se você ver esse erro.

**Figura 2.6 Kleopatra: o diálogo para descriptografar e verificar os resultados: ruim**

![A parte vermelha da janela de resultados mostra "Assinatura inválida", "Assinado com certificado desconhecido", "A assinatura está ruim" e também exibe o nome do arquivo ASC.](images/gnupg-kleopatra-decrypt-invalid-sig.png)

A seção 2.1.4.2, "Verificação de assinatura usando GnuPG", explica por que você provavelmente não vê um resultado verde "Boa assinatura".
