new ClipboardJS('.clipboard-button');
let $discordEmbedForm = $('#discord-embed-form');
if (typeof $discordEmbedForm !== 'undefined' && $discordEmbedForm.length > 0) {
    updateDiscordEmbedCreator(true);
    $('#discord-embed-form textarea, #discord-embed-form input').on('input', function () {
        updateDiscordEmbedCreator(true);
    });
    $('#discord-embed-form input[type="checkbox"]').change(function () {
        updateDiscordEmbedCreator(true);
    });
    let $discordEmbedAddFieldButton = $('#buttonDiscordEmbedAddField');
    $discordEmbedAddFieldButton.click(function () {
        addDiscordEmbedFieldForm(true);
    });
};
let $discordOutputForm = $('#outputEmbedCode');
if (typeof $discordOutputForm !== 'undefined' && $discordOutputForm.length > 0) {
    $discordOutputForm.on('input', function () {
        importDiscordEmbedCreator();
    });
};

function addDiscordEmbedFieldForm(updateCode) {
    let $discordEmbedAddFieldButton = $('#buttonDiscordEmbedAddField1');
    let newIndex = $('.embed-field').length;
    let $newElement = $(
        '<div>' +
        '<label for="inputDiscordEmbedFieldTitle' + newIndex + '">Field Title</label>' +
        '<input type="text" class="form-control form-control-sm inputDiscordEmbedFieldTitles" id="inputDiscordEmbedFieldTitle' + newIndex + '" maxlength="256" autcomplete="off" placeholder="Field title ...">' +
        '<label for="inputDiscordEmbedFieldValue' + newIndex + '">Field Value</label>' +
        '<textarea class="form-control form-control-sm inputDiscordEmbedFieldValues" id="inputDiscordEmbedFieldValue' + newIndex + '" maxlength="1024" autocomplete="off" placeholder="Field value ..."></textarea>' +
        '<input class="form-check-input inputDiscordEmbedFieldInlines" type="checkbox" value="" id="inputDiscordEmbedFieldInline' + newIndex + '" checked>' +
        '<label class="form-check-label" for="inputDiscordEmbedFieldInline' + newIndex + '">' +
        'Inline' +
        '</label>' +
        '</div>').insertAfter($discordEmbedAddFieldButton);
    $newElement.find('textarea, input').on('input', function () {
        updateDiscordEmbedCreator(true);
    });
    $newElement.find('input[type="checkbox"]').change(function () {
        updateDiscordEmbedCreator(true);
    });
    updateDiscordEmbedCreator(updateCode);
};

function updateDiscordEmbedCreator(updateCode) {
    let embedContent = $('#inputDiscordEmbedContent').val();
    let embedAuthorName = $('#inputDiscordEmbedAuthorName').val();
    let embedAuthorPicture = $('#inputDiscordEmbedAuthorPicture').val();
    let embedAuthorLink = $('#inputDiscordEmbedAuthorLink').val();
    let embedTitleText = $('#inputDiscordEmbedTitleText').val();
    let embedDescription = $('#inputDiscordEmbedDescription').val();
    let embedThumbnailLink = $('#inputDiscordEmbedThumbnailLink').val();
    let embedImageLink = $('#inputDiscordEmbedImageLink').val();
    let embedFooterText = $('#inputDiscordEmbedFooterText').val();
    let embedFooterLink = $('#inputDiscordEmbedFooterLink').val();
    let embedColor = $('#inputDiscordEmbedColor').val();

    let embedFieldData = [];
    $('.inputDiscordEmbedFieldTitles').each(function (index) {
        if (typeof embedFieldData[index] === 'undefined') {
            embedFieldData[index] = {};
        }
        embedFieldData[index]['title'] = $(this).val();
    });
    $('.inputDiscordEmbedFieldValues').each(function (index) {
        if (typeof embedFieldData[index] === 'undefined') {
            embedFieldData[index] = {};
        }
        embedFieldData[index]['value'] = $(this).val();
    });
    $('.inputDiscordEmbedFieldInlines').each(function (index) {
        if (typeof embedFieldData[index] === 'undefined') {
            embedFieldData[index] = {};
        }
        embedFieldData[index]['checked'] = $(this).is(':checked');
    });

    let $outputEmbedCode = $('#outputEmbedCode');
    let commandPrefix = $outputEmbedCode.data('command-prefix');

    let command = commandPrefix;

    $('.message-text > .markup').html(parseDiscordMarkdown(embedContent));
    if (embedContent.length > 0) {
        command += 'ptext=' + embedContent + ' | ';
    }
    if (embedAuthorLink.length > 0) {
        if (embedAuthorPicture.length > 0) {
            $('.embed-author').html('<a target="_blank" rel="noreferrer" href="' + embedAuthorLink + '" class="embed-author-name"><img src="' + embedAuthorPicture + '" role="presentation" class="embed-author-icon">' + embedAuthorName + '</a>')
            command += 'author=name=' + embedAuthorName + ' icon=' + embedAuthorPicture + ' url=' + embedAuthorLink + ' | ';
        } else {
            $('.embed-author').html('<a target="_blank" rel="noreferrer" href="' + embedAuthorLink + '" class="embed-author-name">' + embedAuthorName + '</a>');
            command += 'author=name=' + embedAuthorName + ' url=' + embedAuthorLink + ' | ';
        }
    } else {
        if (embedAuthorPicture.length > 0) {
            $('.embed-author').html('<div class="embed-author-name"><img src="' + embedAuthorPicture + '" role="presentation" class="embed-author-icon">' + embedAuthorName + '</div>');
            command += 'author=name=' + embedAuthorName + ' icon=' + embedAuthorPicture + ' | ';
        } else {
            $('.embed-author').html('<div class="embed-author-name">' + embedAuthorName + '</div>');
            if (embedAuthorName.length > 0) {
                command += 'author=' + embedAuthorName + ' | ';
            }
        }
    }
    $('.embed-title').replaceWith('<div class="embed-title">' + parseDiscordMarkdown(embedTitleText) + '</div>')
    if (embedTitleText.length > 0) {
        command += 'title=' + embedTitleText + ' | ';
    }
    $('.embed-description.markup').html(parseDiscordMarkdown(embedDescription));
    if (embedDescription.length > 0) {
        command += 'description=' + embedDescription + ' | ';
    }
    if (embedThumbnailLink.length > 0) {
        $('.embed-rich-thumb').attr('src', embedThumbnailLink).show();
        command += 'thumbnail=' + embedThumbnailLink + ' | ';
    } else {
        $('.embed-rich-thumb').hide();
    }
    if (embedImageLink.length > 0) {
        $('.embed-thumbnail-rich img').attr('src', embedImageLink);
        $('.embed-thumbnail-rich').show();
        command += 'image=' + embedImageLink + ' | ';
    } else {
        $('.embed-thumbnail-rich').hide();
    }

    let numberOfEmbedFieldsInHTML = $('.embed-field').length;
    if (embedFieldData.length - numberOfEmbedFieldsInHTML > 0) {
        for (i = 0; i < embedFieldData.length - numberOfEmbedFieldsInHTML; i++) {
            $('.embed-fields').append('<div class="embed-field">\n' +
                '<div class="embed-field-name"></div><div class="embed-field-value markup"></div>\n' +
                '</div>');
        }
    }
    $.each(embedFieldData, function (index) {
        $('.embed-field-name').eq(index).html(parseDiscordMarkdown(this.title));
        $('.embed-field-value.markup').eq(index).html(parseDiscordMarkdown(this.value));
        if (this.checked) {
            $('.embed-field').eq(index).attr('class', 'embed-field embed-field-inline');
            if (this.title.length > 0 || this.value.length > 0) {
                command += 'field=name=' + this.title + ' value=' + this.value + ' | ';
            }
        } else {
            $('.embed-field').eq(index).attr('class', 'embed-field');
            if (this.title.length > 0 || this.value.length > 0) {
                command += 'field=name=' + this.title + ' value=' + this.value + ' inline=no | ';
            }
        }
    });
    $('.embed-footer').html(embedFooterText);
    if (embedFooterLink.length > 0) {
        $('.embed-footer-icon').attr('src', embedFooterLink).show();
        command += 'footer=name=' + embedFooterText + ' icon=' + embedFooterLink + ' | ';
    } else {
        $('.embed-footer-icon').hide();
        if (embedFooterText.length > 0) {
            command += 'footer=' + embedFooterText + ' | ';
        }
    }
    $('.embed-color-pill').css('background-color', embedColor);
    command += 'color=' + embedColor + ' | ';

    command = command.replace(/\| $/g, '');
    command = command.trim();

    if (updateCode) {
        $outputEmbedCode.val(command);
    }
};

function importDiscordEmbedCreator() {
    let inputValue = $('#outputEmbedCode').val();
    let inputParts = inputValue.split(' ');
    if (inputParts[0].indexOf('=') < 0) {
        inputValue = inputValue.replace(inputParts[0], '');
    }
    if (inputParts[0].indexOf('=') < 0) {
        inputValue = inputValue.replace(inputParts[1], '');
    }
    inputValue = inputValue.trim();

    if (inputValue.length <= 0) {
        return;
    }

    // Code ported from https://github.com/appu1232/Discord-Selfbot/blob/master/cogs/misc.py#L146
    // Reference https://github.com/Seklfreak/Robyul2/blob/master/modules/plugins/embedpost.go#L74
    let messageContent = "", authorName = "", authorPicture = "", authorLink = "", title = "", description = "",
        thumbnail = "", image = "", footerText = "",
        footerLink = "", color = "";

    let inputValues = [];

    $.each(inputValue.split('|'), function () {
        inputValues.push($.trim(this));
    });

    $.each(inputValues, function () {
        let embedValue = this;
        if (embedValue.indexOf('ptext=') === 0) {
            messageContent = embedValue.substr(6, embedValue.length).trim();
        } else if (embedValue.indexOf('title=') === 0) {
            title = embedValue.substr(6, embedValue.length).trim();
        } else if (embedValue.indexOf('description=') === 0) {
            description = embedValue.substr(12, embedValue.length).trim();
        } else if (embedValue.indexOf('desc=') === 0) {
            description = embedValue.substr(5, embedValue.length).trim();
        } else if (embedValue.indexOf('image=') === 0) {
            image = embedValue.substr(6, embedValue.length).trim();
        } else if (embedValue.indexOf('thumbnail=') === 0) {
            thumbnail = embedValue.substr(10, embedValue.length).trim();
        } else if (embedValue.indexOf('colour=') === 0) {
            color = embedValue.substr(7, embedValue.length).trim();
        } else if (embedValue.indexOf('color=') === 0) {
            color = embedValue.substr(6, embedValue.length).trim();
        } else if (embedValue.indexOf('footer=') === 0) {
            footerText = embedValue.substr(7, embedValue.length).trim();
        } else if (embedValue.indexOf('author=') === 0) {
            authorName = embedValue.substr(7, embedValue.length).trim();
        } else if (description.length <= 0 && embedValue.indexOf('field=') !== 0) {
            description = embedValue
        }
    });

    if (authorName.length > 0) {
        if (authorName.indexOf('icon=') >= 0) {
            let authorValues = authorName.split('icon=', 2);
            if (authorValues.length >= 2) {
                if (authorValues[1].indexOf('url=') >= 0) {
                    let iconValues = authorValues[1].split('url=', 2);
                    if (iconValues.length >= 2) {
                        authorName = authorValues[0].substr(5, authorValues[0].length).trim();
                        authorPicture = iconValues[0].trim();
                        authorLink = iconValues[1].trim();
                    }
                } else {
                    authorName = authorValues[0].substr(5, authorValues[0].length).trim();
                    authorPicture = authorValues[1].trim();
                }
            }
        } else {
            if (authorName.indexOf('url=') >= 0) {
                let authorValues = authorName.split('url=', 2);
                if (authorValues.length >= 2) {
                    authorName = authorValues[0].substr(5, authorValues[0].length).trim();
                    authorLink = authorValues[1].trim();
                }
            }
        }
    }

    if (footerText.length > 0) {
        if (footerText.indexOf('icon=') > 0) {
            let footerValues = footerText.split('icon=', 2);
            if (footerValues.length >= 2) {
                footerText = footerValues[0].substr(5, footerValues[0].length).trim();
                footerLink = footerValues[1].trim();
            }
        }
    }

    let embedFieldData = [];
    $.each(inputValues, function () {
        let embedValue = this;
        if (embedValue.indexOf('field=') === 0) {
            let currentIndex = embedFieldData.length;
            embedFieldData[currentIndex] = {
                title: '',
                value: '',
                checked: true
            };
            embedValue = embedValue.substr(6, embedValue.length).trim();
            let fieldValues = embedValue.split('value=', 2);
            if (fieldValues.length >= 2) {
                embedFieldData[currentIndex]['title'] = fieldValues[0].trim();
                embedFieldData[currentIndex]['value'] = fieldValues[1].trim();
            } else if (fieldValues.length >= 1) {
                embedFieldData[currentIndex]['title'] = fieldValues[0].trim();
            }
            if (embedFieldData[currentIndex]['value'].indexOf('inline=') > 0) {
                let fieldValues = embedFieldData[currentIndex]['value'].split('inline=', 2);
                if (fieldValues.length >= 2) {
                    embedFieldData[currentIndex]['value'] = fieldValues[0].trim();
                    if (fieldValues[1].indexOf('false') >= 0 || fieldValues[1].indexOf('no') >= 0) {
                        embedFieldData[currentIndex]['checked'] = false;
                    }
                } else if (fieldValues.length >= 1) {
                    embedFieldData[currentIndex]['value'] = fieldValues[0].trim();
                }
            }
            if (embedFieldData[currentIndex]['title'].indexOf('name=') >= 0) {
                embedFieldData[currentIndex]['title'] = embedFieldData[currentIndex]['title'].substr(5, embedFieldData[currentIndex]['title'].length);
            }
        }
    });

    if (color.length <= 0) {
        color = '#2f3136';
    }

    $('#inputDiscordEmbedContent').val(messageContent);
    $('#inputDiscordEmbedAuthorName').val(authorName);
    $('#inputDiscordEmbedAuthorPicture').val(authorPicture);
    $('#inputDiscordEmbedAuthorLink').val(authorLink);
    $('#inputDiscordEmbedTitleText').val(title);
    $('#inputDiscordEmbedDescription').val(description);
    $('#inputDiscordEmbedThumbnailLink').val(thumbnail);
    $('#inputDiscordEmbedImageLink').val(image);
    $('#inputDiscordEmbedFooterText').val(footerText);
    $('#inputDiscordEmbedFooterLink').val(footerLink);
    $('#inputDiscordEmbedColor').val(color);

    let numberOfEmbedFieldFormsInHTML = $('.inputDiscordEmbedFieldTitles').length;
    createDelayedEmbedFieldFormsWithCallback(embedFieldData.length - numberOfEmbedFieldFormsInHTML, function () {
        $.each(embedFieldData, function (index) {
            $('.inputDiscordEmbedFieldTitles').eq(index).val(this.title);
            $('.inputDiscordEmbedFieldValues').eq(index).val(this.value);
            if (this.checked) {
                $('.inputDiscordEmbedFieldInlines').eq(index).attr('checked', true);
            } else {
                $('.inputDiscordEmbedFieldInlines').eq(index).attr('checked', false);
            }
        });

        updateDiscordEmbedCreator(false);
    });
};
function createDelayedEmbedFieldFormsWithCallback(numberOfForms, callback) {
    if (numberOfForms <= 0) {
        callback();
    } else {
        setTimeout(function () {
            addDiscordEmbedFieldForm(false);
            createDelayedEmbedFieldFormsWithCallback(numberOfForms - 1, callback)
        }, 10);
    }
};
function parseDiscordMarkdown(inputText) {
    var mdParse = SimpleMarkdown.defaultBlockParse;
    var mdOutput = SimpleMarkdown.defaultOutput;
    var syntaxTree = mdParse(inputText);
    return convert(mdOutput(syntaxTree)[0]);
}