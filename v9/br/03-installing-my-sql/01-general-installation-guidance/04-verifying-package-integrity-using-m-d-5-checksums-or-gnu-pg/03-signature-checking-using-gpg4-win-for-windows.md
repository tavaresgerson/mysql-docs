#### 2.1.4.3 Verificação de Assinaturas Usando o Gpg4win para Windows

A Seção 2.1.4.2, “Verificação de Assinaturas Usando GnuPG”, descreve como verificar downloads do MySQL usando GPG. Esse guia também se aplica ao Microsoft Windows, mas outra opção é usar uma ferramenta de interface gráfica como o Gpg4win. Você pode usar uma ferramenta diferente, mas nossos exemplos são baseados no Gpg4win e utilizam sua interface gráfica integrada `Kleopatra`.

Faça o download e instale o Gpg4win, carregue Kleopatra e adicione o certificado da MySQL Release Engineering. Faça isso clicando em Arquivo, Procurar no Servidor. Digite “MySQL Release Engineering” na caixa de pesquisa e pressione Pesquisar.

**Figura 2.1 Kleopatra: Assistente de Procurar no Servidor: Encontrando um Certificado**

![Mostra um campo de entrada de pesquisa intitulado “Encontrar” com “MySQL Release Engineering” digitado. O único resultado contém os seguintes valores: Nome=MySQL Release Engineering, E-Mail=mysql-build@oss.oracle.com, Válido a partir=2021-12-14, Válido até="Desconhecido" e ID da Chave=467B 942D 3A79 BD29. Os botões de ação disponíveis são: Pesquisar, Selecionar Tudo, Desmarcar Tudo, Detalhes, Importar e Fechar.](images/gnupg-kleopatra-find-certificate.png)

Selecione o certificado “MySQL Release Engineering”. O ID da Chave deve referenciar “3A79 BD29”, ou escolha Detalhes... para confirmar que o certificado é válido. Agora, importe-o clicando em Importar. Quando o diálogo de importação for exibido, escolha Ok, e este certificado deve agora estar listado na aba Certificados Importado.

Em seguida, conceda confiança ao certificado. Selecione nosso certificado, então, no menu principal, selecione Certificados, Alterar Poder de Certificação e clique em Conceder Poder.

**Figura 2.2 Kleopatra: Conceder Poder de Certificação para MySQL Release Engineering**

![Uma janela de "Certificação de Poder de Concessão" é exibida. Os botões de ação disponíveis são: Conceder Poder e Cancelar.](images/gnupg-kleopatra-grant-certification-power.png)

Em seguida, verifique o arquivo do pacote MySQL baixado. Isso requer arquivos tanto para o arquivo embalado quanto para a assinatura. O arquivo de assinatura deve ter o mesmo nome que o arquivo embalado, mas com a extensão `.asc` anexada, conforme mostrado no exemplo na tabela a seguir. A assinatura está vinculada na página de downloads para cada produto MySQL. Você deve criar o arquivo `.asc` com essa assinatura.

**Tabela 2.2 Arquivos de Pacote e Assinatura MySQL para MySQL Server MSI para Microsoft Windows**

<table><thead><tr> <th>Tipo de Arquivo</th> <th>Nome do Arquivo</th> </tr></thead><tbody><tr> <td>Arquivo de Distribuição</td> <td><code>mysql-9.5.0-winx64.msi</code></td> </tr><tr> <td>Arquivo de Assinatura</td> <td><code>mysql-9.5.0-winx64.msi.asc</code></td> </tr></tbody></table>

Certifique-se de que ambos os arquivos estejam armazenados no mesmo diretório e, em seguida, execute o seguinte comando para verificar a assinatura do arquivo de distribuição. Carregue a janela a partir do Arquivo, Decrypta/Verifique Arquivos..., e então escolha o arquivo `.asc`.

Os dois resultados mais comuns parecem as seguintes figuras; e embora o aviso "Os dados não puderam ser verificados." pareça problemático, a verificação do arquivo passou com sucesso. Para obter informações adicionais sobre o que esse aviso significa, clique em Mostrar Log de Auditoria e compare-o com a Seção 2.1.4.2, “Verificação de Assinatura Usando GnuPG”. Agora você pode executar o arquivo MSI.

**Figura 2.3 Kleopatra: a Janela de Resultados de Decrypta e Verifica: Sucesso**

![Mostra "Os dados não puderam ser verificados", e também são exibidas informações importantes, como o KeyID e o endereço de e-mail, a data de assinatura da chave e também exibe o nome do arquivo ASC.](images/gnupg-kleopatra-decrypt-okay-sig.png)

Ver um erro como Verificação falhou: Sem dados significa que o arquivo é inválido. Não execute o arquivo MSI se você ver esse erro.

**Figura 2.4 Kleopatra: o Diálogo de Resultados de Decryptagem e Verificação: Inválido**

![Mostra "Verificação falhou: Sem dados." e também exibe o nome do arquivo ASC.](images/gnupg-kleopatra-decrypt-invalid-sig.png)